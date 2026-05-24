import cartModel from "../models/cart.model.js";
import productModel from "../models/product.models.js";

export const addToCart = async (req, res) => {

    const { productId, variantId } = req.params

    const product = await productModel.findOne({
        _id: productId,
        "variants.id": variantId
    })

    if (!product) {
        return res.status(404).json({ message: "Product or variant not found", success: false })
    }


    const cart = (await cartModel.findOneAndUpdate({ user: req.user._id })) ||
        (await cartModel.create({ user: req.user._id }))
    const IsProductExists = cart.items.some(item => item.product.toString() === productId && item.variant.toString() === variantId)

    if (IsProductExists) {

    }



}
