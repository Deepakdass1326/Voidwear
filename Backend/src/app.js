import express from "express"
import cookieParser from "cookie-parser"
import morgan from "morgan"
import authRouter from "./routes/auth.routes.js"
import cors from "cors"


const app = express()
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
}) )

app.use(express.json())
app.use(cookieParser())
app.use(morgan("dev"))

app.use(express.urlencoded({ extended: true}))



app.get("/", (req, res) => {
    res.status(200).json({ message: "Server is running!" });
});

app.use('/api/auth', authRouter)

export default app