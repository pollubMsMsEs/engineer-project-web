import mongoose from "mongoose";
import Image from "../../../models/image.js";

export async function createImageTestData(userId: mongoose.Types.ObjectId) {
    const images = [
        {
            _id: new mongoose.Types.ObjectId(),
            image: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8b8FQDwAFLQG463LdcAAAAABJRU5ErkJggg==",
            type: "image/png",
        },
        {
            _id: new mongoose.Types.ObjectId(),
            image: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mMM/M9QDwAEygHRPdNFnAAAAABJRU5ErkJggg==",
            type: "image/png",
        },
        {
            _id: new mongoose.Types.ObjectId("507f191e810c19729de860e3"),
            image: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
            type: "image/png",
        },
        {
            _id: new mongoose.Types.ObjectId("507f191e810c19729de860e4"),
            image: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5ChHgAHKAJhygi/lgAAAABJRU5ErkJggg==",
            type: "image/png",
        },
    ];

    await Image.create(images);

    return { updateId: images[2]._id, deleteId: images[3]._id };
}
export default createImageTestData;
