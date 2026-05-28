import cartModel from "../models/cart.model.js";
import productModel from "../models/product.models.js";
import { stockOfVariants } from "../dao/product.dao.js";
import mongoose from "mongoose";


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

    let cart = await cartModel.aggregate([
        {
            $match: {
                user: new mongoose.Types.ObjectId(user._id)
            }
        },
        { $unwind: { path: '$items' } },
        {
            $lookup: {
                from: 'products',
                localField: 'items.product',
                foreignField: '_id',
                as: 'items.products'
            }
        },
        { $unwind: { path: '$items.products' } },
        {
            $unwind: {
                path: '$items.products.variants'
            }
        },
        {
            $match: {
                $expr: {
                    $eq: [
                        '$items.variant',
                        '$items.products.variants._id'
                    ]
                }
            }
        },
        {
            $addFields: {
                'items.itemPrice': {
                    $multiply: [
                        '$items.quantity',
                        '$items.products.variants.price.amount'
                    ]
                }
            }
        },
        {
            $group: {
                _id: '$_id',
                totalPrice: { $sum: '$items.itemPrice' },
                currency: {
                    $first:
                        '$items.products.variants.price.currency'
                },
                items: { $push: '$items' }
            }
        }
    ]);

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
