import cartModel from "../models/cart.model.js";
import mongoose from "mongoose";

export async function getCartDetails (userId) {

    const cart = await cartModel.aggregate([
        {
            $match: {
                user: new mongoose.Types.ObjectId(userId)
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

  return cart

}