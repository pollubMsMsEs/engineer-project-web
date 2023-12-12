import mongoose from "mongoose";
import User from "../../../models/user.js";
import Person from "../../../models/person.js";
import Work from "../../../models/work.js";
import WorkFromAPI from "../../../models/workFromAPI.js";
import WorkInstance from "../../../models/workInstance.js";

export async function createWorkTestData(userId: mongoose.Types.ObjectId) {
    const person1 = new Person({
        _id: new mongoose.Types.ObjectId(),
        name: "Name1",
        nick: "Nick1",
        surname: "Surname1",
    });

    const person2 = new Person({
        _id: new mongoose.Types.ObjectId(),
        name: "Name2",
        nick: "Nick2",
        surname: "Surname2",
    });

    await person1.save();
    await person2.save();

    const works = [
        {
            _id: new mongoose.Types.ObjectId(),
            created_by: new mongoose.Types.ObjectId(userId),
            title: "Title1",
            cover: "",
            description: "",
            published_at: new Date(),
            genres: [],
            metadata: {},
            people: [
                {
                    person_id: new mongoose.Types.ObjectId(person1._id),
                    role: "Author",
                    details: {},
                },
            ],
            type: "book",
        },
        {
            _id: new mongoose.Types.ObjectId(),
            created_by: new mongoose.Types.ObjectId(userId),
            title: "Title2",
            cover: "",
            description: "",
            published_at: new Date(),
            genres: [],
            metadata: {},
            people: [
                {
                    person_id: new mongoose.Types.ObjectId(person2._id),
                    role: "Author",
                    details: {},
                },
            ],
            type: "movie",
        },
        {
            _id: new mongoose.Types.ObjectId(),
            created_by: new mongoose.Types.ObjectId(userId),
            title: "Title3",
            cover: "",
            description: "",
            published_at: new Date(),
            genres: [],
            metadata: {},
            people: [
                {
                    person_id: new mongoose.Types.ObjectId(person1._id),
                    role: "Author",
                    details: {},
                },
            ],
            type: "game",
        },
        {
            _id: new mongoose.Types.ObjectId("507f191e810c19729de860ea"),
            created_by: new mongoose.Types.ObjectId(userId),
            title: "Test Update",
            description: "Opis",
            published_at: new Date(),
            genres: ["<script></script>"],
            metadata: {
                "<script></script>": "<p>",
            },
            type: "book",
        },
        {
            _id: new mongoose.Types.ObjectId("507f191e810c19729de860eb"),
            created_by: new mongoose.Types.ObjectId(userId),
            title: "Test Delete",
            description: "Opis",
            published_at: new Date(),
            genres: ["<script></script>"],
            metadata: {
                "<script></script>": "<p>",
            },
            type: "book",
        },
    ];

    await Work.create(works);

    return { updateId: works[3]._id, deleteId: works[4]._id };
}
export default createWorkTestData;
