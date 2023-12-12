import chai from "chai";
import chaiHttp from "chai-http";
import app from "../../app.js";
import User from "../../models/user.js";
import Work from "../../models/work.js";
import createWorkTestData from "./data/work.js";
import mongoose from "mongoose";
import Person from "../../models/person.js";

chai.use(chaiHttp);

const expect = chai.expect;

let token: string;
let WorkToUpdateId: any;
let WorkToDeleteId: any;
let WorkIds: any;
let user: any;

beforeAll(async () => {
    const registerResponse = await chai
        .request(app)
        .post("/api/register")
        .send({
            name: "IntegrationWorkTests",
            email: "iWork@gmail.com",
            password: "iWork123!",
        });

    expect(registerResponse).to.have.status(201);

    const loginResponse = await chai.request(app).post("/api/login").send({
        email: "iWork@gmail.com",
        password: "iWork123!",
    });

    expect(loginResponse).to.have.status(200);

    token = loginResponse.body.token;

    user = await User.findOne({ email: "iWork@gmail.com" });

    WorkIds = await createWorkTestData(user._id);
    WorkToUpdateId = WorkIds.updateId;
    WorkToDeleteId = WorkIds.deleteId;
});

afterAll(async () => {
    await User.deleteMany();
    await Work.deleteMany();
    await Person.deleteMany();
    mongoose.connection.close();
});

describe("GET /all", () => {
    it("powinno zwrócić wszystkie dzieła ze szczegółami", (done) => {
        chai.request(app)
            .get("/api/work/all")
            .set("Authorization", `Bearer ${token}`)
            .end((err: any, res: any) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an("array");
                res.body.forEach((work: any) => {
                    expect(work).to.include.keys(
                        "_id",
                        "created_by",
                        "title",
                        "type"
                    );
                    expect(work._id).to.be.a("string");
                    expect(work.created_by).to.be.a("string");
                    expect(work.title).to.be.a("string");
                    expect(work.type).to.be.a("string");
                });
                done();
            });
    });
});

describe("GET /all/summary", () => {
    it("powinno zwrócić wszystkie dzieła bez szczegółów", (done) => {
        chai.request(app)
            .get("/api/work/all/summary")
            .set("Authorization", `Bearer ${token}`)
            .end((err: any, res: any) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an("array");
                res.body.forEach((work: any) => {
                    expect(work).to.include.keys("_id", "title");
                    expect(work).to.not.include.keys("created_by", "type");
                    expect(work._id).to.be.a("string");
                    expect(work.title).to.be.a("string");
                });
                done();
            });
    });
});

describe("GET /all/:type", () => {
    it("powinno zwrócić wszystkie książki ze szczegółami", (done) => {
        chai.request(app)
            .get("/api/work/all/book")
            .set("Authorization", `Bearer ${token}`)
            .end((err: any, res: any) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an("object");
                expect(res.body).to.have.property("data");
                res.body.data.forEach((work: any) => {
                    expect(work).to.include.keys(
                        "_id",
                        "created_by",
                        "title",
                        "type"
                    );
                    expect(work.type).to.be.equal("book");
                });
                done();
            });
    });
});

describe("GET /count", () => {
    it("powinno zwrócić liczbę dzieł", (done) => {
        chai.request(app)
            .get("/api/work/count")
            .set("Authorization", `Bearer ${token}`)
            .end((err: any, res: any) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an("object");
                expect(res.body).to.have.property("count");
                expect(res.body.count).to.be.a("number");
                done();
            });
    });
});

describe("GET /:id", () => {
    it("powinno zwrócić dzieło", (done) => {
        chai.request(app)
            .get("/api/work/" + WorkToUpdateId.toString())
            .set("Authorization", `Bearer ${token}`)
            .end((err: any, res: any) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an("object");
                expect(res.body).to.have.property("data");
                done();
            });
    });
});

describe("POST /create", () => {
    it("powinno stworzyć dzieło", (done) => {
        const workData = {
            title: "Test",
            description: "Opis",
            published_at: "2022-04-05",
            genres: ["<script></script>"],
            metadata: {
                "<script></script>": "<p>",
            },
            people: [],
            type: "book",
        };

        chai.request(app)
            .post("/api/work/create")
            .set("Authorization", `Bearer ${token}`)
            .send(workData)
            .end((err: any, res: any) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an("object");
                expect(res.body.acknowledged).to.be.equal(true);
                expect(res.body.created).to.have.property("_id");
                expect(res.body.created.title).to.be.equal(workData.title);
                expect(res.body.created.type).to.be.equal(workData.type);
                done();
            });
    });
});

describe("PUT /:id", () => {
    it("powinno zaktualizować dzieło", (done) => {
        const workData = {
            title: "Test updated",
            description: "Opis updated",
            published_at: new Date(),
            genres: ["<script></script>"],
            metadata: {
                "<script></script>": "<p>",
            },
            type: "book",
        };

        chai.request(app)
            .put("/api/work/" + WorkToUpdateId.toString())
            .set("Authorization", `Bearer ${token}`)
            .send(workData)
            .end((err: any, res: any) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an("object");
                expect(res.body.acknowledged).to.be.equal(true);
                expect(res.body).to.have.property("updated");
                expect(res.body.updated.title).to.be.equal(workData.title);
                expect(res.body.updated.type).to.be.equal(workData.type);
                done();
            });
    });
});

describe("DELETE /:id", () => {
    it("powinno usunąć dzieło", (done) => {
        chai.request(app)
            .delete("/api/work/" + WorkToDeleteId.toString())
            .set("Authorization", `Bearer ${token}`)
            .end((err: any, res: any) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an("object");
                expect(res.body.acknowledged).to.be.equal(true);
                expect(res.body).to.have.property("deleted");
                done();
            });
    });
});
