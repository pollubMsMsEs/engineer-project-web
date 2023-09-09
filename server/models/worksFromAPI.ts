import { Schema, model } from "mongoose";

const WorksFromAPISchema = new Schema({
    api_id: { type: String },
    type: { type: String, enum: ['movie', 'book', 'computerGame'] },
});

export default model("WorksFromAPI", WorksFromAPISchema, "worksFromAPI");