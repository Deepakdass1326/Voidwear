import cartModel from "../models/cart.model.js";
import productModel from "../models/product.models.js";
import { stockOfVariants } from "../dao/product.dao.js";
import { createOrder } from "../services/payment.service.js";
import { getCartDetails } from "../dao/cart.dao.js";
import paymentModel from "../models/payment.model.js";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js";
import { config } from "../config/config.js";


export const addToCart = async (req, res) => {

    const { productId, variantId } = req.params;
    // variantId may be the string "null" from URL params — normalise it
    const resolvedVariantId = (variantId && variantId !== 'null' && variantId !== 'undefined')
        ? variantId
        : null;

    const { quantity = 1 } = req.body;

    // ── Validate product exists ─────────────────────────────────────────────
    let product;
    if (resolvedVariantId) {
        // Variant product: make sure the variant belongs to this product
        product = await productModel.findOne({
            _id: productId,
            "variants._id": resolvedVariantId
        });
    } else {
        // Base product (no variant selected)
        product = await productModel.findById(productId);
    }

    if (!product) {
        return res.status(404).json({ message: "Product or variant not found", success: false });
    }

    // ── Stock check ─────────────────────────────────────────────────────────
    const stock = await stockOfVariants(productId, resolvedVariantId);

    // ── Get or create cart ──────────────────────────────────────────────────
    const cart = (await cartModel.findOne({ user: req.user._id })) ||
        (await cartModel.create({ user: req.user._id }));

    // Uniqueness key: productId + variantId (null for base products)
    const existingItem = cart.items.find(item => {
        const sameProduct = item.product.toString() === productId;
        const sameVariant = resolvedVariantId
            ? item.variant?.toString() === resolvedVariantId
            : !item.variant; // both null/undefined
        return sameProduct && sameVariant;
    });

    if (existingItem) {
        // Item already in cart — check stock then increment
        if (existingItem.quantity + quantity > stock) {
            return res.status(400).json({ message: "Not enough stock", success: false });
        }

        const filter = resolvedVariantId
            ? { user: req.user._id, "items.product": productId, "items.variant": resolvedVariantId }
            : { user: req.user._id, "items.product": productId, "items.variant": null };

        await cartModel.findOneAndUpdate(
            filter,
            { $inc: { "items.$.quantity": quantity } },
            { new: true }
        );

        return res.status(200).json({ message: "Cart updated successfully", success: true });
    }

    // ── New item ─────────────────────────────────────────────────────────────
    if (quantity > stock) {
        return res.status(400).json({ message: "Not enough stock", success: false });
    }

    cart.items.push({
        product: productId,
        variant: resolvedVariantId || null,
        quantity,
    });

    await cart.save();

    return res.status(200).json({
        message: "Item added to cart successfully",
        success: true
    });
};

export const getCart = async (req, res) => {
    const user = req.user;


    let cart = await getCartDetails(user._id)


    if (!cart || cart.length === 0) {
        const newCart = await cartModel.create({ user: user._id });
        return res.status(200).json({
            message: "Cart fetched successfully",
            success: true,
            cart: newCart
        });
    }

    return res.status(200).json({
        message: "Cart fetched successfully",
        success: true,
        cart: cart[0]
    });
};

export const updateQuantity = async (req, res) => {
    const { productId, variantId } = req.params;
    const resolvedVariantId = (variantId && variantId !== 'null' && variantId !== 'undefined')
        ? variantId
        : null;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
        return res.status(400).json({ message: "Quantity must be at least 1", success: false });
    }

    const stock = await stockOfVariants(productId, resolvedVariantId);

    if (quantity > stock) {
        return res.status(400).json({ message: "Not enough stock", success: false });
    }

    const filter = resolvedVariantId
        ? { user: req.user._id, "items.product": productId, "items.variant": resolvedVariantId }
        : { user: req.user._id, "items.product": productId, "items.variant": null };

    const cart = await cartModel.findOneAndUpdate(
        filter,
        { $set: { "items.$.quantity": quantity } },
        { new: true }
    );

    if (!cart) {
        return res.status(404).json({ message: "Cart item not found", success: false });
    }

    return res.status(200).json({ message: "Quantity updated", success: true });
};

export const removeItem = async (req, res) => {
    const { productId, variantId } = req.params;
    const resolvedVariantId = (variantId && variantId !== 'null' && variantId !== 'undefined')
        ? variantId
        : null;

    const pullCondition = resolvedVariantId
        ? { product: productId, variant: resolvedVariantId }
        : { product: productId, variant: null };

    const updated = await cartModel.findOneAndUpdate(
        { user: req.user._id },
        { $pull: { items: pullCondition } },
        { new: true }
    );

    if (!updated) {
        return res.status(404).json({ message: "Cart not found", success: false });
    }

    return res.status(200).json({ message: "Item removed", success: true });
};

export const createPaymentOrder = async (req, res) => {

    const cartResult = await getCartDetails(req.user._id);
    const cart = cartResult?.[0];

    if (!cart) {
        return res.status(404).json({
            success: false,
            message: "Cart not found",
        });
    }

    const order = await createOrder({ amount: cart.totalPrice, currency: cart.currency })

    const payment = await paymentModel.create({
        user: req.user._id,
        razorpay: {
            orderId: order.id,
        },
        price: {
            amount: cart.totalPrice,
            currency: cart.currency
        },
        orderItems: cart.items.map(item => ({
            title: item.products?.title,
            productId: item.products?._id,
            variantId: item.variant,
            quantity: item.quantity,
            price: {
                amount: item.products?.variants?.price?.amount,
                currency: item.products?.variants?.price?.currency
            },
            image: item.products?.variants?.images || item.products?.image,
            discription: item.products?.discription
        }))
    });

    return res.status(200).json({
        message: "Order created successfully",
        success: true,
        order,
    });
}

export const verifyOrder = async (req, res) => {

    const {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature
    } = req.body;

    // Find the pending payment record created when the order was placed
    const payment = await paymentModel.findOne({
        "razorpay.orderId": razorpay_order_id,
        status: "pending"
    });

    if (!payment) {
        return res.status(404).json({
            success: false,
            message: "Payment not found",
        });
    }

    const isPaymentValid = validatePaymentVerification(
        {
            order_id: razorpay_order_id,
            payment_id: razorpay_payment_id,
        },
        razorpay_signature,
        config.RAZORPAY_KEY_SECRET
    );

    if (!isPaymentValid) {
        payment.status = "failed";
        await payment.save();
        return res.status(400).json({
            success: false,
            message: "Payment verification failed",
        });
    }

    payment.status = "success";
    payment.razorpay.paymentId = razorpay_payment_id;
    payment.razorpay.signature = razorpay_signature;
    await payment.save();

    return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
    });
}