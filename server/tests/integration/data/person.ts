import mongoose from "mongoose";
import Person from "../../../models/person.js";

export async function createPeopleTestData(userId: mongoose.Types.ObjectId) {
    const people = [
        {
            _id: new mongoose.Types.ObjectId(),
            name: "Name1",
            nick: "Nick1",
            surname: "Surname1",
        },
        {
            _id: new mongoose.Types.ObjectId(),
            name: "Name2",
            nick: "Nick2",
            surname: "Surname2",
        },
        {
            _id: new mongoose.Types.ObjectId(),
            name: "Name3",
            nick: "Nick3",
            surname: "Surname3",
        },
        {
            _id: new mongoose.Types.ObjectId("507f191e810c19729de860e1"),
            name: "Name Create test",
            nick: "Nick Create test",
            surname: "Surname Update test",
        },
        {
            _id: new mongoose.Types.ObjectId("507f191e810c19729de860e2"),
            name: "Name Update test",
            nick: "Nick Update test",
            surname: "Surname Delete test",
        },
    ];

    await Person.create(people);

    return { updateId: people[3]._id, deleteId: people[4]._id };
}
export default createPeopleTestData;
