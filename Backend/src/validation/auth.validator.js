import { body, validationResult } from "express-validator"


function validateRequest(req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    next()
}


export const registerValidation = [
    body("email").isEmail().withMessage("Please provide a valid email address"),

    body("fullname").isLength({ min: 4, max: 12 }).withMessage("Full name must be between 4 and 12 characters long")
        .notEmpty().withMessage("Full name is required"),

    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),

    body("contact").matches(/^\d{10}$/).withMessage("Contact number must be  10 digits ")
        .notEmpty().withMessage("Contact number is required"),
    body("isSeller").isBoolean().withMessage("is seller must be a boolean value"),    

    validateRequest
]


export const loginValidation = [
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password").notEmpty().withMessage("password is required"),
    validateRequest
]