import chai from "chai";
import chaiHttp from "chai-http";
import app from "../../app.js";
import User from "../../models/user.js";
import Work from "../../models/work.js";
import WorkFromAPI from "../../models/workFromAPI.js";
import WorkInstance from "../../models/workInstance.js";
import Person from "../../models/person.js";
import createWorkInstanceTestData from "./data/workInstance.js";
import mongoose from "mongoose";

chai.use(chaiHttp);

const expect = chai.expect;

let token: string;
let WorkToUpdateId: any;
let WorkToDeleteId: any;
let WorkIds: any;
let user: any;
let workFromAPIData: any;
let workInstanceData: any;

beforeAll(async () => {
    const registerResponse = await chai
        .request(app)
        .post("/api/register")
        .send({
            name: "IntegrationWorkInstTests",
            email: "iWorkInst@gmail.com",
            password: "iWorkInst123!",
        });

    expect(registerResponse).to.have.status(201);

    const loginResponse = await chai.request(app).post("/api/login").send({
        email: "iWorkInst@gmail.com",
        password: "iWorkInst123!",
    });

    expect(loginResponse).to.have.status(200);

    token = loginResponse.body.token;

    user = await User.findOne({ email: "iWorkInst@gmail.com" });

    WorkIds = await createWorkInstanceTestData(user._id);
    WorkToUpdateId = WorkIds.updateId;
    WorkToDeleteId = WorkIds.deleteId;

    workFromAPIData = await WorkFromAPI.create({
        _id: new mongoose.Types.ObjectId(),
        api_id: "999",
        title: "Api Create",
        cover: "",
        type: "book",
    });
});

afterAll(async () => {
    await Work.deleteMany();
    await WorkFromAPI.deleteMany();
    await WorkInstance.deleteMany();
    await Person.deleteMany();
    await User.findOneAndDelete({ email: "iWorkInst@gmail.com" });
    mongoose.connection.close();
});

describe("GET /all", () => {
    it("powinno zwrócić wszystkie instancje dzieł wszystkich użytkowników ze szczegółami", (done) => {
        chai.request(app)
            .get("/api/workInstance/all")
            .set("Authorization", `Bearer ${token}`)
            .end((err: any, res: any) => {
                if (err) {
                    done(err);
                }

                expect(res).to.have.status(200);
                expect(res.body).to.be.an("array");
                res.body.forEach((work: any) => {
                    expect(work._id).to.be.a("string");
                    expect(work.work_id).to.be.an("object");
                    expect(work.work_id).to.have.property("title");
                    expect(work.user_id).to.be.a("string");
                    expect(work.onModel).to.be.a("string");
                    expect(work.type).to.be.a("string");
                    expect(work.from_api).to.be.a("boolean");
                });
                done();
            });
    });
});

describe("GET /me", () => {
    it("powinno zwrócić wszystkie instancje dzieł zalogowanego użytkownika ze szczegółami ", (done) => {
        chai.request(app)
            .get("/api/workInstance/me")
            .set("Authorization", `Bearer ${token}`)
            .end((err: any, res: any) => {
                if (err) {
                    done(err);
                }

                expect(res).to.have.status(200);
                expect(res.body).to.be.an("object");
                expect(res.body).to.have.property("data");
                res.body.data.forEach((work: any) => {
                    expect(work._id).to.be.a("string");
                    expect(work.user_id).to.be.equal(user._id.toString());
                    expect(work.work_id).to.be.an("object");
                    expect(work.work_id).to.have.property("title");
                    expect(work.user_id).to.be.a("string");
                    expect(work.onModel).to.be.a("string");
                    expect(work.type).to.be.a("string");
                    expect(work.from_api).to.be.a("boolean");
                });
                done();
            });
    });
});

describe("GET /:id", () => {
    it("powinno zwrócić instancję dzieła manualnego ze szczegółami", (done) => {
        chai.request(app)
            .get("/api/workInstance/" + WorkToUpdateId.toString())
            .set("Authorization", `Bearer ${token}`)
            .end((err: any, res: any) => {
                if (err) {
                    done(err);
                }

                expect(res).to.have.status(200);
                expect(res.body).to.be.an("object");
                expect(res.body).to.have.property("data");
                expect(res.body.data).to.have.property("_id");
                expect(res.body.data).to.have.property("work_id");
                expect(res.body.data.work_id).to.have.property("title");
                done();
            });
    });
});

describe("GET /:id", () => {
    it("powinno zwrócić instancję dzieła z API ze szczegółami", (done) => {
        chai.request(app)
            .get("/api/workInstance/" + WorkToDeleteId.toString())
            .set("Authorization", `Bearer ${token}`)
            .end((err: any, res: any) => {
                if (err) {
                    done(err);
                }

                expect(res).to.have.status(200);
                expect(res.body).to.be.an("object");
                expect(res.body).to.have.property("data");
                expect(res.body.data).to.have.property("_id");
                expect(res.body.data).to.have.property("work_id");
                expect(res.body.data.work_id).to.have.property("title");
                done();
            });
    });
});

describe("GET /count", () => {
    it("powinno zwrócić liczbę wszystkich statusów dla instancji dzieł zalogowanego użytkownika o podanym typie", (done) => {
        chai.request(app)
            .get("/api/workInstance/count?type=movie")
            .set("Authorization", `Bearer ${token}`)
            .end((err: any, res: any) => {
                if (err) {
                    done(err);
                }

                expect(res).to.have.status(200);
                expect(res.body).to.be.an("object");
                expect(res.body).to.have.property("acknowledged");
                expect(res.body.acknowledged).to.be.equal(true);
                expect(res.body).to.have.property("data");
                expect(res.body.data).to.have.property("todo");
                expect(res.body.data.todo).to.be.a("number");
                expect(res.body.data).to.have.property("completed");
                expect(res.body.data.completed).to.be.a("number");
                done();
            });
    });
});

describe("POST /create", () => {
    it("powinno stworzyć instancję dzieła z API", (done) => {
        workInstanceData = {
            work_id: workFromAPIData._id.toString(),
            onModel: "WorkFromAPI",
            rating: 6,
            description: "Test description created123",
            number_of_completions: 3,
            completions: [
                "2021-01-02T23:00:00.000Z",
                "2021-01-03T23:00:00.000Z",
            ],
            status: "completed",
            metadata: {},
        };

        chai.request(app)
            .post("/api/workInstance/create")
            .set("Authorization", `Bearer ${token}`)
            .send(workInstanceData)
            .end((err: any, res: any) => {
                if (err) {
                    done(err);
                }

                expect(res).to.have.status(200);
                expect(res.body).to.be.an("object");
                expect(res.body.acknowledged).to.be.equal(true);
                expect(res.body.created).to.have.property("_id");
                expect(res.body.created.work_id).to.be.an("object");
                expect(res.body.created.work_id).to.have.property("_id");
                expect(res.body.created.work_id._id).to.be.equal(
                    workFromAPIData._id.toString()
                );
                expect(res.body.created.work_id).to.have.property("title");
                expect(res.body.created.work_id.title).to.be.equal(
                    workFromAPIData.title
                );
                expect(res.body.created).to.have.property("user_id");
                expect(res.body.created.description).to.be.equal(
                    workInstanceData.description
                );
                expect(res.body.created.type).to.be.equal(workFromAPIData.type);
                expect(res.body.created.from_api).to.be.equal(true);
                done();
            });
    });
});

describe("PUT /:id", () => {
    it("powinno zaktualizować instancję dzieła", (done) => {
        const workInstanceData = {
            rating: 5,
            description: "Description updated",
            number_of_completions: 3,
            completions: [new Date()],
            status: "completed",
            began_at: "2021-01-01T10:00:00Z",
            finished_at: "2021-01-04T10:00:00Z",
            metadata: {},
        };

        chai.request(app)
            .put("/api/workInstance/" + WorkToUpdateId.toString())
            .set("Authorization", `Bearer ${token}`)
            .send(workInstanceData)
            .end((err: any, res: any) => {
                if (err) {
                    done(err);
                }

                expect(res).to.have.status(200);
                expect(res.body).to.be.an("object");
                expect(res.body.acknowledged).to.be.equal(true);
                expect(res.body).to.have.property("updated");
                expect(res.body.updated.rating).to.be.equal(
                    workInstanceData.rating
                );
                expect(res.body.updated.description).to.be.equal(
                    workInstanceData.description
                );
                expect(res.body.updated.number_of_completions).to.be.equal(
                    workInstanceData.number_of_completions
                );
                done();
            });
    });
});

describe("DELETE /:id", () => {
    it("powinno usunąć instancję dzieła", (done) => {
        chai.request(app)
            .delete("/api/workInstance/" + WorkToDeleteId.toString())
            .set("Authorization", `Bearer ${token}`)
            .end((err: any, res: any) => {
                if (err) {
                    done(err);
                }

                expect(res).to.have.status(200);
                expect(res.body).to.be.an("object");
                expect(res.body.acknowledged).to.be.equal(true);
                expect(res.body).to.have.property("deleted");
                done();
            });
    });
});
