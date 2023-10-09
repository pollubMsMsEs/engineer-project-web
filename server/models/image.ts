import { Schema, model } from "mongoose";

const ImageSchema = new Schema({
    image: { type: String },
    type: {
        type: String,
        enum: [
            "image/apng",
            "image/avif",
            "image/gif",
            "image/jpeg",
            "image/png",
            "image/svg+xml",
            "image/webp",
            "application/xml",
        ],
        required: true,
    },
});

export default model("Image", ImageSchema, "images");
