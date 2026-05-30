import { Router } from "express";
import { loginValidation, registerValidation } from "../validation/auth.validator.js";
import { register, login, googleCallback, getMe } from "../controllers/auth.controller.js";
import passport from "passport";
import { authenticateUser } from "../middleware/auth.middleware.js";
import { config } from "../config/config.js";

const router = Router()


router.post("/register", registerValidation, register)
router.post("/login", loginValidation, login)
router.get("/google",
    passport.authenticate("google", { scope: ["profile", "email"] }))

router.get("/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: `${config.FRONTEND_URL}/register` }),
    googleCallback
)

router.get("/me", authenticateUser, getMe)


export default router