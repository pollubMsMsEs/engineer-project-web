import mongoose from "mongoose";

export default async () => {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }
    await (global as any).MONGO_SERVER.stop();
};
