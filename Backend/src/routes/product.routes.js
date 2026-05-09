import express from "express"
import { authenticateSeller } from "../middleware/auth.middleware.js"
import multer from "multer"
import { createProduct, getProducts, getProductDetails, addProductVariants } from "../controllers/product.controller.js"
import { createProductValidation } from "../validation/product.validator.js"
import { getSellerProduct } from "../controllers/product.controller.js"



const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5mb
    }
})


const router = express.Router()

/**
 * @description Create a new product
 * @route POST /api/products
 * @access Private
 */
router.post("/", authenticateSeller, createProductValidation, upload.array("images", 7), createProduct)

/**
 * @description Get seller products
 * @route GET /api/products/seller
 * @access Private
 */
router.get("/seller", authenticateSeller, getSellerProduct)

/**
 * @description Get all products
 * @route GET /api/products
 * @access Public
 */
router.get("/", getProducts)

/**
 * @description Get product details by id
 * @route GET /api/products/detail/:id
 * @access Private
 */

router.get("/detail/:id", getProductDetails)


/**
 * @description Create a new variant for a product
 * @route POST /api/products/:productId/variants
 * @access Seller Only - Private
 */
router.post("/:productId/variants", authenticateSeller, upload.array("images", 7), addProductVariants)



export default router

