import chai from "chai";
import chaiHttp from "chai-http";
import app from "../../app.js";
import Work from "../../models/work.js";
import WorkFromAPI from "../../models/workFromAPI.js";
import WorkInstance from "../../models/workInstance.js";
import User from "../../models/user.js";
import createReportTestData from "./data/report.js";
import mongoose from "mongoose";

chai.use(chaiHttp);

const expect = chai.expect;

let token: string;
let user: any;

beforeAll(async () => {
    const registerResponse = await chai
        .request(app)
        .post("/api/register")
        .send({
            name: "IntegrationReportTests",
            email: "iReport@gmail.com",
            password: "iReport123!",
        });

    expect(registerResponse).to.have.status(201);

    const loginResponse = await chai.request(app).post("/api/login").send({
        email: "iReport@gmail.com",
        password: "iReport123!",
    });

    expect(loginResponse).to.have.status(200);

    token = loginResponse.body.token;

    user = await User.findOne({ email: "iReport@gmail.com" });

    await createReportTestData(user._id);
});

afterAll(async () => {
    await WorkInstance.deleteMany();
    await Work.deleteMany();
    await WorkFromAPI.deleteMany();
    await User.findOneAndDelete({ email: "iReport@gmail.com" });
    mongoose.connection.close();
});

describe("GET /:reportType", () => {
    it("powinno zwrócić średni czas ukończenia wszystkich dzieł użytkownika", (done) => {
        chai.request(app)
            .get("/api/report/average_completion_time")
            .set("Authorization", `Bearer ${token}`)
            .end((err, res) => {
                if (err) {
                    done(err);
                }

                expect(res).to.have.status(200);
                expect(res.body).to.have.property("average_completion_time");
                expect(res.body.average_completion_time).to.be.a("number");
                done();
            });
    });
});

describe("GET /:reportType", () => {
    it("powinno zwrócić średnią ocenę wszystkich dzieł użytkownika", (done) => {
        chai.request(app)
            .get("/api/report/average_rating")
            .set("Authorization", `Bearer ${token}`)
            .end((err, res) => {
                if (err) {
                    done(err);
                }

                expect(res).to.have.status(200);
                expect(res.body).to.have.property("average_rating");
                expect(res.body.average_rating).to.be.a("number");
                done();
            });
    });
});

describe("GET /:reportType", () => {
    it("powinno zwrócić liczbę dzieł użytkownika podzieloną na typy", (done) => {
        chai.request(app)
            .get("/api/report/count_by_type")
            .set("Authorization", `Bearer ${token}`)
            .end((err, res) => {
                if (err) {
                    done(err);
                }

                expect(res).to.have.status(200);
                expect(res.body).to.have.property("count_by_type");
                expect(res.body.count_by_type).to.be.an("object");
                expect(res.body.count_by_type.book).to.be.a("number");
                expect(res.body.count_by_type.movie).to.be.a("number");
                expect(res.body.count_by_type.game).to.be.a("number");
                done();
            });
    });
});

describe("GET /:reportType", () => {
    it("powinno zwrócić tablicę z liczbą ukończeń dzieł w danym dniu przez użytkownika", (done) => {
        chai.request(app)
            .get("/api/report/completions_by_date")
            .set("Authorization", `Bearer ${token}`)
            .end((err, res) => {
                if (err) {
                    done(err);
                }

                expect(res).to.have.status(200);
                expect(res.body).to.have.property("completions_by_date");
                expect(res.body.completions_by_date).to.be.an("array");
                res.body.completions_by_date.forEach((pair: any) => {
                    expect(pair).to.have.property("day");
                    expect(pair.day).to.be.a("string");
                    expect(pair).to.have.property("total");
                    expect(pair.total).to.be.a("number");
                });
                done();
            });
    });
});

describe("GET /:reportType", () => {
    it("powinno zwrócić liczbę ukończonych dzieł użytkownika", (done) => {
        chai.request(app)
            .get("/api/report/finished_count")
            .set("Authorization", `Bearer ${token}`)
            .end((err, res) => {
                if (err) {
                    done(err);
                }

                expect(res).to.have.status(200);
                expect(res.body).to.have.property("finished_count");
                expect(res.body.finished_count).to.be.a("number");
                done();
            });
    });
});
