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
            "image/bmp",
            "image/x-icon",
            "image/tiff",
            "image/heif",
            "image/heic",
            "image/jfif",
            "image/pjpeg",
            "image/pjp",
            "image/x-png",
            "image/x-citrix-png",
            "image/x-citrix-jpeg",
            "image/x-windows-bmp",
            "application/xml",
        ],
        required: true,
        default: "image/jpeg",
    },
});

export default model("Image", ImageSchema, "images");
