import { config } from "./config.js";
import mongoose from "mongoose";

const connectDB = async () => {
    await mongoose.connect(config.MONGO_URI)
    console.log("mongoDB connected");
    
}

export default connectDB