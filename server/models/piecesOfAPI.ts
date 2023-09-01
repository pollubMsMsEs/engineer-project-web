import { Schema, model } from "mongoose";

const PiecesOfAPISchema = new Schema({
    api_id: { type: String },
    type: { type: String },
});

export default model("PiecesOfAPI", PiecesOfAPISchema);