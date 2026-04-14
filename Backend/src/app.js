import express from "express"
import cookieParser from "cookie-parser"
import morgan from "morgan"
import authRouter from "./routes/auth.routes.js"
import cors from "cors"
import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import { config } from "./config/config.js"






const app = express()
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
}))

passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/api/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile)
}))

app.use(express.json())
app.use(cookieParser())
app.use(morgan("dev"))
app.use(passport.initialize())

app.use(express.urlencoded({ extended: true }))



app.get("/", (req, res) => {
    res.status(200).json({ message: "Server is running!" });
});

app.use('/api/auth', authRouter)

export default app