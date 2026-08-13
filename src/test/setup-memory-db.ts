import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let memoryServer: MongoMemoryServer;

/** Mongo chạy trong bộ nhớ cho test, không đụng tới database thật. */
export async function connectMemoryDatabase(): Promise<void> {
  memoryServer = await MongoMemoryServer.create();
  await mongoose.connect(memoryServer.getUri(), { dbName: "EvonHubTest" });
}

export async function disconnectMemoryDatabase(): Promise<void> {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  await memoryServer.stop();
}

export async function clearCollections(): Promise<void> {
  const collections = (await mongoose.connection.db?.collections()) ?? [];

  for (const collection of collections) {
    await collection.deleteMany({});
  }
}
