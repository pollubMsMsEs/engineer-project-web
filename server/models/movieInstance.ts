import { Schema, model } from "mongoose";

const MovieInstanceSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: "User" },
    movie_id: { type: Schema.Types.ObjectId, ref: "Movie" },
    rating: { type: Number, min: 0, max: 10 },
    description: { type: String },
    number_of_viewings: { type: Number, min: 0 },
    viewings: { type: [Date] },
    completed: { type: Boolean, default: true },
});

export default model("MovieInstance", MovieInstanceSchema);