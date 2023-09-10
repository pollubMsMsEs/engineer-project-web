import { Schema, model } from "mongoose";

const WorkSchema = new Schema({
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
            _id: false, //Mongoose by default creates id for subdocuments, this stops it from doing that
            person_id: {
                type: Schema.Types.ObjectId,
                ref: "Person",
                required: true,
            },
            role: { type: String, required: true },
            details: {
                type: Map,
                of: [String],
            },
        },
    ],
    type: { type: String, enum: ['movie', 'book', 'computerGame'] },
});

export default model("Work", WorkSchema, "works");
