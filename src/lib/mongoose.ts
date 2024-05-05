"use server";
import mongoose from "mongoose";
let isConnected: boolean = false;
export const connectToDatabase = async () => {
  if (!process.env.MONGODB_URL) {
    throw new Error("MONGODB_URL is not defined");
  }
  if (isConnected) {
    console.log("MongoDB is already connected");
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: "EvonHub",
    });
    isConnected = true;
    console.log("=> using new database connection");
  } catch (error) {
    console.log("=> error while connecting with database:");
  }
};
