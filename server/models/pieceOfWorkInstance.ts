import { Schema, model } from "mongoose";

const PieceOfWorkInstanceSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: "User" },
    piece_of_work_id: { type: Schema.Types.ObjectId, refPath: 'onModel' },
    onModel: { type: String, enum: ['Movie', 'PiecesOfAPI'] },
    rating: { type: Number, min: 0, max: 10 },
    description: { type: String },
    number_of_viewings: { type: Number, min: 0 },
    viewings: { type: [Date] },
    status: { type: String },
    type: { type: String },
    from_api: { type: Boolean, default: false },
});

export default model("PieceOfWorkInstance", PieceOfWorkInstanceSchema);