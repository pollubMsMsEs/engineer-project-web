import { Schema, model } from "mongoose";

const MovieSchema = new Schema({
    created_by: { type: Schema.Types.ObjectId, ref: "User" },
    title: { type: String, required: true },
    dev: { type: Boolean, default: true },
    description: String,
    published_at: Date,
    genres: [String], //TODO: Should enforce uniqueness of values in array?
    metadata: {
        type: Map,
        of: [String],
    },
    people: [
        {
            person_id: {
                type: Schema.Types.ObjectId,
                ref: "Person",
                required: true,
            },
            role: { type: String, required: true },
            details: {
                type: Map,
                of: String,
            },
        },
    ],
});

export default model("Movie", MovieSchema);
