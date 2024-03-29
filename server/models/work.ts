import { Schema, model } from "mongoose";

function normalizeCoverURL(work: any & { cover?: string }) {
    let baseUrl;
    if (!process.env.PRODUCTION) {
        baseUrl = `http://localhost:${process.env.PORT}/api/image/`;
    } else {
        baseUrl = `${process.env.URL}/api/image/`;
    }

    if (!work?.cover || work.cover.startsWith(baseUrl)) {
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
        description: String,
        published_at: Date,
        genres: [String],
        metadata: {
            type: Map,
            of: [String],
        },
        people: [
            {
                _id: false,
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
        type: { type: String, enum: ["movie", "book", "game"] },
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
