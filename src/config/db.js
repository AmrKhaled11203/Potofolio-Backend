import mongoose from "mongoose";

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error(
      "MONGO_URI environment variable is not defined. " +
        "Please set it in your Railway Variables (or .env file locally).",
    );
  }
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB Connected");
};

export default connectDB;
