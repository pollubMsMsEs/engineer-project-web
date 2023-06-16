import { Schema, model } from "mongoose";
import jwt from "jsonwebtoken";

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
});

UserSchema.methods.generateAuthToken = function () {
    if (!process.env.JWT_KEY) throw new Error("Missing JWT KEY");

    const token = jwt.sign(
        { _id: this._id, name: this.name },
        process.env.JWT_KEY,
        {
            expiresIn: "7d",
        }
    );
    return token;
};

export default model("User", UserSchema);
