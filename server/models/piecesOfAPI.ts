import { Schema, model } from "mongoose";

const PiecesOfAPISchema = new Schema({
    api_id: { type: String },
    type: { type: String, enum: ['Movie', 'Book', 'ComputerGame'] },
});

export default model("PiecesOfAPI", PiecesOfAPISchema);