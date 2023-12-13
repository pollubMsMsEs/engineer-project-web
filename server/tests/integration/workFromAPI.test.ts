import chai from "chai";
import chaiHttp from "chai-http";
import app from "../../app.js";
import User from "../../models/user.js";
import WorkFromAPI from "../../models/workFromAPI.js";
import createWorkFromAPITestData from "./data/workFromAPI.js";
import mongoose from "mongoose";

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
            name: "IntegrationAPITests",
            email: "iApi@gmail.com",
            password: "iApiWork123!",
        });

    expect(registerResponse).to.have.status(201);

    const loginResponse = await chai.request(app).post("/api/login").send({
        email: "iApi@gmail.com",
        password: "iApiWork123!",
    });

    expect(loginResponse).to.have.status(200);

    token = loginResponse.body.token;

    user = await User.findOne({ email: "iApi@gmail.com" });

    WorkIds = await createWorkFromAPITestData(user._id);
    WorkToUpdateId = WorkIds.updateId;
    WorkToDeleteId = WorkIds.deleteId;
});

afterAll(async () => {
    await WorkFromAPI.deleteMany();
    await User.findOneAndDelete({ email: "iApi@gmail.com" });
    mongoose.connection.close();
});

describe("GET /all", () => {
    it("powinno zwrócić wszystkie dzieła ze szczegółami", (done) => {
        chai.request(app)
            .get("/api/workFromAPI/all")
            .set("Authorization", `Bearer ${token}`)
            .end((err: any, res: any) => {
                if (err) {
                    done(err);
                }

                expect(res).to.have.status(200);
                expect(res.body).to.be.an("array");
                res.body.forEach((work: any) => {
                    expect(work).to.include.keys("_id", "title", "type");
                    expect(work._id).to.be.a("string");
                    expect(work.title).to.be.a("string");
                    expect(work.type).to.be.a("string");
                });
                done();
            });
    });
});

describe("GET /all/:type", () => {
    it("powinno zwrócić wszystkie książki ze szczegółami", (done) => {
        chai.request(app)
            .get("/api/workFromAPI/all/book")
            .set("Authorization", `Bearer ${token}`)
            .end((err: any, res: any) => {
                if (err) {
                    done(err);
                }

                expect(res).to.have.status(200);
                expect(res.body).to.be.an("object");
                expect(res.body).to.have.property("data");
                res.body.data.forEach((work: any) => {
                    expect(work).to.include.keys("_id", "title", "type");
                    expect(work.type).to.be.equal("book");
                });
                done();
            });
    });
});

describe("GET /:id", () => {
    it("powinno zwrócić dzieło", (done) => {
        chai.request(app)
            .get("/api/workFromAPI/" + WorkToUpdateId.toString())
            .set("Authorization", `Bearer ${token}`)
            .end((err: any, res: any) => {
                if (err) {
                    done(err);
                }

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
            api_id: "999",
            title: "Api Create",
            type: "book",
        };

        chai.request(app)
            .post("/api/workFromAPI/create")
            .set("Authorization", `Bearer ${token}`)
            .send(workData)
            .end((err: any, res: any) => {
                if (err) {
                    done(err);
                }

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
            api_id: "333",
            title: "Api title updated",
            type: "book",
        };

        chai.request(app)
            .put("/api/workFromAPI/" + WorkToUpdateId.toString())
            .set("Authorization", `Bearer ${token}`)
            .send(workData)
            .end((err: any, res: any) => {
                if (err) {
                    done(err);
                }

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
            .delete("/api/workFromAPI/" + WorkToDeleteId.toString())
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
