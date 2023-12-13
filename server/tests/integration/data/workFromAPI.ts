import mongoose from "mongoose";
import WorkFromAPI from "../../../models/workFromAPI.js";

export async function createWorkFromAPITestData(
    userId: mongoose.Types.ObjectId
) {
    const worksFromAPI = [
        {
            _id: new mongoose.Types.ObjectId(),
            api_id: "OL82565W",
            title: "Api title0",
            cover: "",
            type: "book",
        },
        {
            _id: new mongoose.Types.ObjectId(),
            api_id: "111",
            title: "Api title1",
            cover: "",
            type: "movie",
        },
        {
            _id: new mongoose.Types.ObjectId(),
            api_id: "222",
            title: "Api title2",
            cover: "",
            type: "game",
        },
        {
            _id: new mongoose.Types.ObjectId("507f191e810c19729de860ec"),
            api_id: "333",
            title: "Api Update",
            cover: "",
            type: "book",
        },
        {
            _id: new mongoose.Types.ObjectId("507f191e810c19729de860ed"),
            api_id: "444",
            title: "Api Delete",
            cover: "",
            type: "book",
        },
    ];

    await WorkFromAPI.create(worksFromAPI);

    return { updateId: worksFromAPI[3]._id, deleteId: worksFromAPI[4]._id };
}
export default createWorkFromAPITestData;
