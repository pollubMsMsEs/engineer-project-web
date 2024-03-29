import { Schema, model } from "mongoose";

const WorkInstanceSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: "User" },
    work_id: { type: Schema.Types.ObjectId, refPath: "onModel" },
    onModel: { type: String, enum: ["Work", "WorkFromAPI"] },
    rating: { type: Number, min: 0, max: 5 },
    description: { type: String },
    number_of_completions: { type: Number, min: 0 },
    completions: { type: [Date] },
    status: { type: String, enum: ["wishlist", "todo", "doing", "completed"] },
    type: { type: String, enum: ["movie", "book", "game"] },
    from_api: { type: Boolean, default: false },
    began_at: { type: Date },
    finished_at: { type: Date },
    metadata: {
        type: Map,
        of: [String],
    },
});

export default model("WorkInstance", WorkInstanceSchema, "workInstances");
