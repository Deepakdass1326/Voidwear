import { Router } from "express";
import { loginValidation, registerValidation } from "../validation/auth.validator.js";
import { register, login, googleCallback} from "../controllers/auth.controller.js";
import passport from "passport";

const router = Router()


router.post("/register", registerValidation, register)
router.post("/login", loginValidation, login)
router.get("/google",
    passport.authenticate("google", { scope: ["profile", "email"] }))

router.get("/google/callback",
    passport.authenticate("google", { session: false , failureRedirect: "http://localhost:5173/register" }),
    googleCallback
)

router.get("/me", authenticateUser, getMe)


export default router