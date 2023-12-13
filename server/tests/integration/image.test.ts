import chai from "chai";
import chaiHttp from "chai-http";
import app from "../../app.js";
import User from "../../models/user.js";
import createImageTestData from "./data/image.js";
import mongoose from "mongoose";
import Image from "../../models/image.js";

chai.use(chaiHttp);

const expect = chai.expect;

let token: string;
let ImageToUpdateId: any;
let ImageToDeleteId: any;
let ImageIds: any;
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

    ImageIds = await createImageTestData(user._id);
    ImageToUpdateId = ImageIds.updateId;
    ImageToDeleteId = ImageIds.deleteId;
});

afterAll(async () => {
    await Image.deleteMany();
    await User.deleteMany();
    mongoose.connection.close();
});

describe("GET /all", () => {
    it("powinno zwrócić wszystkie obrazy", (done) => {
        chai.request(app)
            .get("/api/image/all")
            .set("Authorization", `Bearer ${token}`)
            .end((err: any, res: any) => {
                if (err) {
                    done(err);
                }

                expect(res).to.have.status(200);
                expect(res.body).to.be.an("array");
                res.body.forEach((url: any) => {
                    expect(url).to.match(/^https?:\/\/.+/);
                });
                done();
            });
    });
});

describe("GET /count", () => {
    it("powinno zwrócić liczbę obrazów", (done) => {
        chai.request(app)
            .get("/api/image/count")
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

describe("GET /get/:id", () => {
    it("powinno zwrócić obraz (dane)", (done) => {
        chai.request(app)
            .get("/api/image/get/" + ImageToUpdateId.toString())
            .set("Authorization", `Bearer ${token}`)
            .end((err: any, res: any) => {
                if (err) {
                    done(err);
                }

                expect(res).to.have.status(200);
                expect(res.body).to.be.an("object");
                expect(res.body).to.have.property("data");
                expect(res.body.data).to.have.property("_id");
                expect(res.body.data).to.have.property("image");
                expect(res.body.data).to.have.property("type");
                done();
            });
    });
});

describe("POST /create", () => {
    it("powinno stworzyć obraz", (done) => {
        chai.request(app)
            .post("/api/image/create")
            .set("Authorization", `Bearer ${token}`)
            .attach("image", "./tests/integration/data/images/image1.svg")
            .end((err: any, res: any) => {
                if (err) {
                    done(err);
                }

                expect(res).to.have.status(200);
                expect(res.body).to.be.an("object");
                expect(res.body.acknowledged).to.be.equal(true);
                expect(res.body.created).to.be.a("string");
                done();
            });
    });
});

describe("PUT /:id", () => {
    it("powinno zaktualizować obraz", (done) => {
        chai.request(app)
            .put("/api/image/" + ImageToUpdateId.toString())
            .set("Authorization", `Bearer ${token}`)
            .attach("image", "./tests/integration/data/images/image2.svg")
            .end((err: any, res: any) => {
                if (err) {
                    done(err);
                }

                expect(res).to.have.status(200);
                expect(res.body).to.be.an("object");
                expect(res.body.acknowledged).to.be.equal(true);
                expect(res.body.updated).to.be.a("string");
                done();
            });
    });
});

describe("DELETE /:id", () => {
    it("powinno usunąć obraz", (done) => {
        chai.request(app)
            .delete("/api/image/" + ImageToDeleteId.toString())
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

describe("GET /:id", () => {
    it("powinno zwrócić obraz (wyświetlić)", (done) => {
        chai.request(app)
            .get("/api/image/" + ImageToUpdateId.toString())
            .set("Authorization", `Bearer ${token}`)
            .end((err, res) => {
                if (err) {
                    done(err);
                }

                expect(res).to.have.status(200);
                expect(res).to.have.header("Content-Type", /image\/.+/);
                done();
            });
    });
});
