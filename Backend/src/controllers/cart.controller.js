import cartModel from "../models/cart.model.js";
import productModel from "../models/product.models.js";
import { stockOfVariants } from "../dao/product.dao.js";




export const addToCart = async (req, res) => {

    const { productId, variantId } = req.params
    const { quantity = 1 } = req.body

    const product = await productModel.findOne({
        _id: productId,
        "variants._id": variantId
    })

    if (!product) {
        return res.status(404).json({ message: "Product or variant not found", success: false })
    }

    const stock = await stockOfVariants(productId, variantId)


    const cart = (await cartModel.findOne({ user: req.user._id })) ||
        (await cartModel.create({ user: req.user._id }))
    const IsProductExists = cart.items.some(item => item.product.toString() === productId && item.variant.toString() === variantId)

    if (IsProductExists) {
        const quantityInCart = cart.items.find(item => item.product.toString() === productId && item.variant.toString() === variantId).quantity

        if (quantityInCart + quantity > stock) {
            return res.status(400).json({ message: "Not enough stock", success: false })
        }

        await cartModel.findOneAndUpdate(
            { user: req.user._id, "items.product": productId, "items.variant": variantId },
            { $inc: { "items.$.quantity": quantity } },
            { new: true }

        )

        return res.status(200).json(
            {
                message: "Cart updated successfully",
                success: true
            }
        )
    }

    if (quantity > stock) {
        return res.status(400).json({ message: "Not enough stock", success: false })
    }

    cart.items.push({
        product: productId,
        variant: variantId,
        quantity,
    })

    await cart.save()

    return res.status(200).json({
        message: "Item added to cart successfully",
        success: true
    })



}

export const getCart = async (req, res) => {
    const user = req.user

    let cart = await cartModel.findOne({ user: user._id }).populate('items.product')

    if (!cart) {
        cart = await cartModel.create({ user: user._id })
    }

    return res.status(200).json({
        message: "Cart fetched successfully",
        success: true,
        cart
    })
}

export const updateQuantity = async (req, res) => {
    const { productId, variantId } = req.params
    const { quantity } = req.body

    if (!quantity || quantity < 1) {
        return res.status(400).json({ message: "Quantity must be at least 1", success: false })
    }

    const stock = await stockOfVariants(productId, variantId)

    if (quantity > stock) {
        return res.status(400).json({ message: "Not enough stock", success: false })
    }

    const cart = await cartModel.findOneAndUpdate(
        { user: req.user._id, "items.product": productId, "items.variant": variantId },
        { $set: { "items.$.quantity": quantity } },
        { new: true }
    ).populate('items.product')

    if (!cart) {
        return res.status(404).json({ message: "Cart item not found", success: false })
    }

    return res.status(200).json({
        message: "Quantity updated",
        success: true,
        cart
    })
}

export const removeItem = async (req, res) => {
    const { productId, variantId } = req.params

    const cart = await cartModel.findOneAndUpdate(
        { user: req.user._id },
        { $pull: { items: { product: productId, variant: variantId } } },
        { new: true }
    ).populate('items.product')

    if (!cart) {
        return res.status(404).json({ message: "Cart not found", success: false })
    }

    return res.status(200).json({
        message: "Item removed",
        success: true,
        cart
    })
}
