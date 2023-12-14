import chai from "chai";
import chaiHttp from "chai-http";
import app from "../../app.js";
import User from "../../models/user.js";
import mongoose from "mongoose";

chai.use(chaiHttp);

const expect = chai.expect;

let token: string;

beforeAll(async () => {
    const registerResponse = await chai
        .request(app)
        .post("/api/register")
        .send({
            name: "IntegrationSearchTests",
            email: "iSearch@gmail.com",
            password: "iSearch123!",
        });

    expect(registerResponse).to.have.status(201);

    const loginResponse = await chai.request(app).post("/api/login").send({
        email: "iSearch@gmail.com",
        password: "iSearch123!",
    });

    expect(loginResponse).to.have.status(200);

    token = loginResponse.body.token;
});

afterAll(async () => {
    await User.findOneAndDelete({ email: "iSearch@gmail.com" });
    mongoose.connection.close();
});

describe("GET /:id", () => {
    it("powinno zwrócić książki z API OpenLibrary (do dwudziestu na stronie)", (done) => {
        chai.request(app)
            .get("/api/search/book")
            .set("Authorization", `Bearer ${token}`)
            .query({ query: "Harry", page: "1" })
            .end((err: any, res: any) => {
                if (err) {
                    done(err);
                }

                expect(res).to.have.status(200);
                expect(res.body).to.be.an("array");
                expect(res.body).to.have.lengthOf.at.most(20);
                res.body.forEach((book: any) => {
                    expect(book).to.have.property("title");
                    expect(book.title).to.be.a("string");
                    expect(book).to.have.property("cover");
                    expect(book.cover).to.be.a("string");
                    expect(book).to.have.property("has_instance");
                    expect(book.has_instance).to.be.a("boolean");
                    expect(book).to.have.property("api_key");
                    expect(book.api_key).to.be.a("string");
                    expect(book).to.have.property("type");
                    expect(book.type).to.be.equal("book");
                });
                done();
            });
    }, 10000);

    it("powinno zwrócić filmy z API TMDB (do dwudziestu na stronie)", (done) => {
        chai.request(app)
            .get("/api/search/movie")
            .set("Authorization", `Bearer ${token}`)
            .query({ query: "Harry", page: "1" })
            .end((err: any, res: any) => {
                if (err) {
                    done(err);
                }

                expect(res).to.have.status(200);
                expect(res.body).to.be.an("array");
                expect(res.body).to.have.lengthOf.at.most(20);
                res.body.forEach((book: any) => {
                    expect(book).to.have.property("title");
                    expect(book.title).to.be.a("string");
                    expect(book).to.have.property("cover");
                    expect(book.cover).to.be.a("string");
                    expect(book).to.have.property("has_instance");
                    expect(book.has_instance).to.be.a("boolean");
                    expect(book).to.have.property("api_key");
                    expect(book.api_key).to.be.a("string");
                    expect(book).to.have.property("type");
                    expect(book.type).to.be.equal("movie");
                });
                done();
            });
    }, 10000);

    it("powinno zwrócić gry z API IGDB (do dwudziestu na stronie)", (done) => {
        chai.request(app)
            .get("/api/search/game")
            .set("Authorization", `Bearer ${token}`)
            .query({ query: "Minecraft", page: "1" })
            .end((err: any, res: any) => {
                if (err) {
                    done(err);
                }

                expect(res).to.have.status(200);
                expect(res.body).to.be.an("array");
                expect(res.body).to.have.lengthOf.at.most(20);
                res.body.forEach((book: any) => {
                    expect(book).to.have.property("title");
                    expect(book.title).to.be.a("string");
                    expect(book).to.have.property("cover");
                    expect(book.cover).to.be.a("string");
                    expect(book).to.have.property("has_instance");
                    expect(book.has_instance).to.be.a("boolean");
                    expect(book).to.have.property("api_key");
                    expect(book.api_key).to.be.a("string");
                    expect(book).to.have.property("type");
                    expect(book.type).to.be.equal("game");
                });
                done();
            });
    }, 10000);
});
