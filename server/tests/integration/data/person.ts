import mongoose from "mongoose";
import Person from "../../../models/person.js";

export async function createPeopleTestData(userId: mongoose.Types.ObjectId) {
    const people = [
        {
            _id: new mongoose.Types.ObjectId(),
            created_by: new mongoose.Types.ObjectId(userId),
            name: "Name1",
            nick: "Nick1",
            surname: "Surname1",
        },
        {
            _id: new mongoose.Types.ObjectId(),
            created_by: new mongoose.Types.ObjectId(userId),
            name: "Name2",
            nick: "Nick2",
            surname: "Surname2",
        },
        {
            _id: new mongoose.Types.ObjectId(),
            created_by: new mongoose.Types.ObjectId(userId),
            name: "Name3",
            nick: "Nick3",
            surname: "Surname3",
        },
        {
            _id: new mongoose.Types.ObjectId("507f191e810c19729de860e1"),
            created_by: new mongoose.Types.ObjectId(userId),
            name: "Name Create test",
            nick: "Nick Create test",
            surname: "Surname Update test",
        },
        {
            _id: new mongoose.Types.ObjectId("507f191e810c19729de860e2"),
            created_by: new mongoose.Types.ObjectId(userId),
            name: "Name Update test",
            nick: "Nick Update test",
            surname: "Surname Delete test",
        },
    ];

    await Person.create(people);

    return { updateId: people[3]._id, deleteId: people[4]._id };
}
export default createPeopleTestData;
