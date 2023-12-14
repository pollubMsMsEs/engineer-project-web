import { Schema, model } from "mongoose";

const PersonSchema = new Schema({
    created_by: { type: Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    nick: { type: String, required: false },
    surname: { type: String, required: true },
});

export default model("Person", PersonSchema, "people");
