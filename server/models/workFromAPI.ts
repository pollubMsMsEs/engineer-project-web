import { Schema, model } from "mongoose";

const WorkFromAPISchema = new Schema({
    api_id: { type: String },
    type: { type: String, enum: ["movie", "book", "game"] },
});

export default model("WorkFromAPI", WorkFromAPISchema, "worksFromAPI");
