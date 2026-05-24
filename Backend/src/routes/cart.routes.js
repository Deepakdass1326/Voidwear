import express from "express"
import { authenticateUser } from "../middleware/auth.middleware.js"
import { validateAddToCart } from "../validation/cart.validator.js"
import { addToCart } from "../controllers/cart.controller.js"
const router = express.router()


/**
 * @route POST /api/cart
 * @desc Add item to cart
 * @access Private
 * @augments productId - ID of the product to add to the cart
 * @augments variantId - ID of the variant of the product to add to the cart
 * @augments quantity - Quantity of the product to add to the cart (Default:1, optional)
 * @augments 
 */

router.post("/add/:productId/:variantId", authenticateUser, validateAddToCart, addToCart)


export default router

