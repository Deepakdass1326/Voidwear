import { body, validationResult } from "express-validator";

function validateRequest(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}


export const createProductValidation = [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("priceAmount").isFloat({ gt: 0 }).withMessage("Price amount must be a positive number"),
    body("priceCurrency").optional().isString().withMessage("Price currency must be a string")
]