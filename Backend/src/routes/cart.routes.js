import express from "express"
import { authenticateUser } from "../middleware/auth.middleware.js"
import { validateAddToCart } from "../validation/cart.validator.js"
import { addToCart, getCart, updateQuantity, removeItem } from "../controllers/cart.controller.js"


const router = express.Router()


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

/**
 * @route GET /api/cart
 * @desc Get cart
 * @access Private
 * 
 */

router.get('/', authenticateUser, getCart)

/**
 * @route PATCH /api/cart/update/:productId/:variantId
 * @desc Update item quantity in cart
 * @access Private
 */
router.patch('/update/:productId/:variantId', authenticateUser, updateQuantity)

/**
 * @route DELETE /api/cart/remove/:productId/:variantId
 * @desc Remove item from cart
 * @access Private
 */
router.delete('/remove/:productId/:variantId', authenticateUser, removeItem)

export default router

