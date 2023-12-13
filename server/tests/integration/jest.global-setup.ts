import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

export default async () => {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }

    (global as any).MONGO_SERVER = await MongoMemoryServer.create();

    process.env.MONGODB = (global as any).MONGO_SERVER.getUri();
};
