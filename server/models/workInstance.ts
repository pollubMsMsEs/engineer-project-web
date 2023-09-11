import { Schema, model } from "mongoose";

const WorkInstanceSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: "User" },
    work_id: { type: Schema.Types.ObjectId, refPath: 'onModel' },
    onModel: { type: String, enum: ['Works', 'WorksFromAPI'] },
    rating: { type: Number, min: 0, max: 10 },
    description: { type: String },
    number_of_viewings: { type: Number, min: 0 },
    viewings: { type: [Date] },
    status: { type: String },
    type: { type: String, enum: ['movie', 'book', 'computerGame'] },
    from_api: { type: Boolean, default: false },
});

export default model("WorkInstance", WorkInstanceSchema, "workInstances");