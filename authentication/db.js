import mongoose from "mongoose"
import "dotenv/config"


export const DBConnection = async (req ,res)  => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Database connection failed:", err);
  }
}


