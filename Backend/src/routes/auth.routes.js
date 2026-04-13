import { Router } from "express";
import { loginValidation, registerValidation } from "../validation/auth.validator.js";
import { register, login } from "../controllers/auth.controller.js";

const router = Router()


router.post("/register", registerValidation, register)
router.post("/login", loginValidation, login)


export default router