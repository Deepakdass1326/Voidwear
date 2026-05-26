import { param, body, validationResult } from "express-validator";


const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}



export const validateAddToCart = [
    param("productId").isMongoId().withMessage("Invalid product ID"),
    // variantId can be a real MongoId OR the sentinel string "null" (base products)
    param("variantId").custom(value => {
        if (!value || value === 'null' || value === 'undefined') return true;
        return /^[a-f\d]{24}$/i.test(value);
    }).withMessage("Invalid variant ID"),
    body("quantity").optional().isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
    validateRequest
]