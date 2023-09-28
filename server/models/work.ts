import { Schema, model } from "mongoose";

function normalizeCoverURL(work: any & { cover?: string }) {
    let baseUrl;
    if (!process.env.PRODUCTION) {
        baseUrl = `http://localhost:${process.env.port}/api/image/`;
    } else {
        baseUrl = `${process.env.URL}/api/image/`;
    }

    if (!work?.cover || work.cover.startsWith(baseUrl)) {
        console.log("not transformed");
        return work;
    } else {
        return { ...work, cover: baseUrl + work.cover.split("/").pop() };
    }
}

const WorkSchema = new Schema(
    {
        created_by: { type: Schema.Types.ObjectId, ref: "User" },
        title: { type: String, required: true },
        cover: { type: String },
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
        type: { type: String, enum: ["movie", "book", "computerGame"] },
    },
    {
        toObject: {
            transform: function (doc, ret, options) {
                return normalizeCoverURL(ret);
            },
        },
        toJSON: {
            transform: function (doc, ret, options) {
                return normalizeCoverURL(ret);
            },
        },
    }
);

export default model("Work", WorkSchema, "works");
