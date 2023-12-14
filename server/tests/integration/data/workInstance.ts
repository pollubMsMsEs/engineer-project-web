import mongoose from "mongoose";
import User from "../../../models/user.js";
import Person from "../../../models/person.js";
import Work from "../../../models/work.js";
import WorkFromAPI from "../../../models/workFromAPI.js";
import WorkInstance from "../../../models/workInstance.js";

export async function createWorkInstanceTestData(
    userId: mongoose.Types.ObjectId
) {
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        name: "Test123",
        email: "test123@test.com",
        password: "password",
    });

    await user.save();

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
            created_by: new mongoose.Types.ObjectId(user._id),
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
            created_by: new mongoose.Types.ObjectId(user._id),
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
            created_by: new mongoose.Types.ObjectId(user._id),
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
    ];

    await Work.create(works);

    const worksFromAPI = [
        {
            _id: new mongoose.Types.ObjectId(),
            api_id: "OL82565W",
            title: "Title4",
            cover: "",
            type: "book",
        },
        {
            _id: new mongoose.Types.ObjectId(),
            api_id: "111",
            title: "Title5",
            cover: "",
            type: "game",
        },
        {
            _id: new mongoose.Types.ObjectId(),
            api_id: "222",
            title: "Title6",
            cover: "",
            type: "movie",
        },
    ];

    await WorkFromAPI.create(worksFromAPI);

    const workInstances = [
        {
            user_id: new mongoose.Types.ObjectId(user._id),
            work_id: new mongoose.Types.ObjectId(works[0]._id),
            onModel: "Work",
            rating: 1,
            description: "",
            number_of_completions: 4,
            completions: [
                "2021-01-01T15:00:00.000Z",
                "2021-01-02T00:00:00.000Z",
                "2021-01-03T14:00:00.000Z",
            ],
            status: "completed",
            type: "book",
            from_api: false,
            began_at: "2021-01-01T10:00:00Z",
            finished_at: "2021-01-02T10:00:00Z",
            metadata: {},
        },
        {
            user_id: new mongoose.Types.ObjectId(userId),
            work_id: new mongoose.Types.ObjectId(works[1]._id),
            onModel: "Work",
            rating: 2,
            description: "",
            number_of_completions: 2,
            completions: [
                "2021-01-01T11:00:00.000Z",
                "2021-01-02T11:00:00.000Z",
            ],
            status: "todo",
            type: "movie",
            from_api: false,
            began_at: "2021-01-01T10:00:00Z",
            finished_at: "2021-01-03T10:00:00Z",
            metadata: {},
        },
        {
            _id: new mongoose.Types.ObjectId("507f191e810c19729de860ee"),
            user_id: new mongoose.Types.ObjectId(userId),
            work_id: new mongoose.Types.ObjectId(works[2]._id),
            onModel: "Work",
            rating: 3,
            description: "",
            number_of_completions: 2,
            completions: [],
            status: "completed",
            type: "game",
            from_api: false,
            began_at: "2021-01-01T10:00:00Z",
            finished_at: "2021-01-04T10:00:00Z",
            metadata: {},
        },
        {
            user_id: new mongoose.Types.ObjectId(userId),
            work_id: new mongoose.Types.ObjectId(worksFromAPI[0]._id),
            onModel: "WorkFromAPI",
            rating: 4,
            description: "",
            number_of_completions: 2,
            completions: [],
            status: "completed",
            type: "book",
            from_api: true,
            began_at: "2021-01-01T10:00:00Z",
            finished_at: "2021-01-02T10:00:00Z",
            metadata: {},
        },
        {
            user_id: new mongoose.Types.ObjectId(userId),
            work_id: new mongoose.Types.ObjectId(worksFromAPI[1]._id),
            onModel: "WorkFromAPI",
            rating: 5,
            description: "",
            number_of_completions: 4,
            completions: [],
            status: "completed",
            type: "game",
            from_api: true,
            began_at: "2021-01-01T10:00:00Z",
            finished_at: "2021-01-03T10:00:00Z",
            metadata: {},
        },
        {
            _id: new mongoose.Types.ObjectId("507f191e810c19729de860ef"),
            user_id: new mongoose.Types.ObjectId(userId),
            work_id: new mongoose.Types.ObjectId(worksFromAPI[2]._id),
            onModel: "WorkFromAPI",
            rating: 5,
            description: "",
            number_of_completions: 5,
            completions: [
                "2021-01-02T23:00:00.000Z",
                "2021-01-03T23:00:00.000Z",
            ],
            status: "completed",
            type: "movie",
            from_api: true,
            began_at: "2021-01-01T10:00:00Z",
            finished_at: "2021-01-04T10:00:00Z",
            metadata: {},
        },
    ];

    await WorkInstance.create(workInstances);

    return { updateId: workInstances[2]._id, deleteId: workInstances[5]._id };
}
export default createWorkInstanceTestData;
