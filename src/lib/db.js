import mongoose from "mongoose"

export const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://nityam:ollama@cluster0.ptufwmv.mongodb.net/")
        console.log("MongoDB connected")
    } catch (error) {
        console.error("❌ DB connection failed");
        process.exit(1);
    }
}