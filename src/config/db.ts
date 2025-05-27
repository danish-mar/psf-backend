import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("✅ MongoDB Connected");
  } catch (error: any) {
    console.error("❌ DB Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
