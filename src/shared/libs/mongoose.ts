import "server-only";
import mongoose from "mongoose";

interface MongooseConnectionCache {
  connectionPromise: Promise<typeof mongoose> | null;
}

// Lưu promise trên globalThis để hot reload (dev) và các lần gọi đồng thời
// (Promise.all trong page) dùng chung một kết nối thay vì mỗi lần connect lại
const globalWithMongoose = globalThis as typeof globalThis & {
  mongooseConnectionCache?: MongooseConnectionCache;
};

const connectionCache: MongooseConnectionCache =
  globalWithMongoose.mongooseConnectionCache ?? { connectionPromise: null };

globalWithMongoose.mongooseConnectionCache = connectionCache;

export const connectToDatabase = async () => {
  if (!process.env.MONGODB_URL) {
    throw new Error("MONGODB_URL is not defined");
  }

  if (mongoose.connection.readyState === 1) return;

  if (!connectionCache.connectionPromise) {
    connectionCache.connectionPromise = mongoose.connect(
      process.env.MONGODB_URL,
      {
        dbName: "EvonHub",
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
      },
    );
  }

  try {
    await connectionCache.connectionPromise;
  } catch (error) {
    // Bỏ promise lỗi để lần gọi sau thử kết nối lại
    connectionCache.connectionPromise = null;
    console.log("=> error while connecting with database:", error);
    throw error;
  }
};
