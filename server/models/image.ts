import { Schema, model } from "mongoose";

const ImageSchema = new Schema({
    image: { type: String },
});

export default model("Image", ImageSchema, "images");