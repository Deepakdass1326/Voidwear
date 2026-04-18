import express from "express"
import { authenticateSeller } from "../middleware/auth.middleware.js"
import multer from "multer"
import { createProduct } from "../controllers/product.controller.js"
import { createProductValidation } from "../validation/product.validator.js"
import { getSellerProduct } from "../controllers/product.controller.js"


const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5mb
    }
})


const router = express.Router()


router.post("/", authenticateSeller, createProductValidation, upload.array("images", 7), createProduct)


router.get("/seller", authenticateSeller,getSellerProduct )





export default router

