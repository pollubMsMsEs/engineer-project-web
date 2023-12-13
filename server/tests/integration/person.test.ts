import chai from "chai";
import chaiHttp from "chai-http";
import app from "../../app.js";
import User from "../../models/user.js";
import createPeopleTestData from "./data/person.js";
import mongoose from "mongoose";
import Person from "../../models/person.js";

chai.use(chaiHttp);

const expect = chai.expect;

let token: string;
let PersonToUpdateId: any;
let PersonToDeleteId: any;
let PeopleIds: any;
let user: any;

beforeAll(async () => {
    const registerResponse = await chai
        .request(app)
        .post("/api/register")
        .send({
            name: "IntegrationPersonTests",
            email: "iPerson@gmail.com",
            password: "iPerson123!",
        });

    expect(registerResponse).to.have.status(201);

    const loginResponse = await chai.request(app).post("/api/login").send({
        email: "iPerson@gmail.com",
        password: "iPerson123!",
    });

    expect(loginResponse).to.have.status(200);

    token = loginResponse.body.token;

    user = await User.findOne({ email: "iPerson@gmail.com" });

    PeopleIds = await createPeopleTestData(user._id);
    PersonToUpdateId = PeopleIds.updateId;
    PersonToDeleteId = PeopleIds.deleteId;
});

afterAll(async () => {
    await Person.deleteMany();
    await User.findOneAndDelete({ email: "iPerson@gmail.com" });
    mongoose.connection.close();
});

describe("GET /all", () => {
    it("powinno zwrócić wszystkie osoby", (done) => {
        chai.request(app)
            .get("/api/person/all")
            .set("Authorization", `Bearer ${token}`)
            .end((err: any, res: any) => {
                if (err) {
                    done(err);
                }

                expect(res).to.have.status(200);
                expect(res.body).to.be.an("array");
                res.body.forEach((work: any) => {
                    expect(work).to.include.keys("_id", "name", "surname");
                    expect(work._id).to.be.a("string");
                    expect(work.name).to.be.a("string");
                    expect(work.surname).to.be.a("string");
                });
                done();
            });
    });
});

describe("GET /count", () => {
    it("powinno zwrócić liczbę osób", (done) => {
        chai.request(app)
            .get("/api/person/count")
            .set("Authorization", `Bearer ${token}`)
            .end((err: any, res: any) => {
                if (err) {
                    done(err);
                }

                expect(res).to.have.status(200);
                expect(res.body).to.be.an("object");
                expect(res.body).to.have.property("count");
                expect(res.body.count).to.be.a("number");
                done();
            });
    });
});

describe("GET /:id", () => {
    it("powinno zwrócić osobę", (done) => {
        chai.request(app)
            .get("/api/person/" + PersonToUpdateId.toString())
            .set("Authorization", `Bearer ${token}`)
            .end((err: any, res: any) => {
                if (err) {
                    done(err);
                }

                expect(res).to.have.status(200);
                expect(res.body).to.be.an("object");
                expect(res.body).to.have.property("data");
                expect(res.body.data).to.have.property("_id");
                expect(res.body.data).to.have.property("name");
                expect(res.body.data).to.have.property("surname");
                done();
            });
    });
});

describe("POST /create", () => {
    it("powinno stworzyć osobę", (done) => {
        const personData = {
            name: "Name created",
            nick: "Nick created",
            surname: "Surname created",
        };

        chai.request(app)
            .post("/api/person/create")
            .set("Authorization", `Bearer ${token}`)
            .send(personData)
            .end((err: any, res: any) => {
                if (err) {
                    done(err);
                }

                expect(res).to.have.status(200);
                expect(res.body).to.be.an("object");
                expect(res.body.acknowledged).to.be.equal(true);
                expect(res.body.created).to.have.property("_id");
                expect(res.body.created.name).to.be.equal(personData.name);
                expect(res.body.created.nick).to.be.equal(personData.nick);
                expect(res.body.created.surname).to.be.equal(
                    personData.surname
                );
                done();
            });
    });
});

describe("PUT /:id", () => {
    it("powinno zaktualizować osobę", (done) => {
        const personData = {
            name: "Name updated",
            nick: "Nick updated",
            surname: "Surname updated",
        };

        chai.request(app)
            .put("/api/person/" + PersonToUpdateId.toString())
            .set("Authorization", `Bearer ${token}`)
            .send(personData)
            .end((err: any, res: any) => {
                if (err) {
                    done(err);
                }

                expect(res).to.have.status(200);
                expect(res.body).to.be.an("object");
                expect(res.body.acknowledged).to.be.equal(true);
                expect(res.body).to.have.property("updated");
                expect(res.body.updated).to.have.property("_id");
                expect(res.body.updated.name).to.be.equal(personData.name);
                expect(res.body.updated.nick).to.be.equal(personData.nick);
                expect(res.body.updated.surname).to.be.equal(
                    personData.surname
                );
                done();
            });
    });
});

describe("DELETE /:id", () => {
    it("powinno usunąć osobę", (done) => {
        chai.request(app)
            .delete("/api/person/" + PersonToDeleteId.toString())
            .set("Authorization", `Bearer ${token}`)
            .end((err: any, res: any) => {
                if (err) {
                    done(err);
                }

                expect(res).to.have.status(200);
                expect(res.body).to.be.an("object");
                expect(res.body.acknowledged).to.be.equal(true);
                expect(res.body).to.have.property("deleted");
                expect(res.body.deleted).to.have.property("_id");
                done();
            });
    });
});
