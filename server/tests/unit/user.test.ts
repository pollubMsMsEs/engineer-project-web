import * as sinon from "sinon";
import * as chai from "chai";
import sinonChai from "sinon-chai";
import User from "../../models/user.js";
import { Request, Response } from "express";
import { login, register } from "../../controllers/user.js";
import bcrypt from "bcrypt";

chai.use(sinonChai);

const expect = chai.expect;

let req: Partial<Request | any>;
let res: Partial<Response>;
let next: sinon.SinonSpy;
let UserMock: sinon.SinonMock;

beforeEach(() => {
    UserMock = sinon.mock(User);

    res = {
        json: sinon.spy(),
        send: sinon.spy(),
        status: sinon.stub().returnsThis(),
    };
    next = sinon.spy();
    process.env.SALT = "mockedSALT";
});
afterEach(() => {
    sinon.restore();
});

describe("register", () => {
    it("powinno zarejestrować użytkownika", async () => {
        req = {
            body: {
                name: "Mock123",
                email: "mock@gmail.com",
                password: "Mock123!",
            },
        };

        const mockUser: any = new User({
            name: "Mock123",
            email: "mock@gmail.com",
            password: "hashedPassword",
        });

        sinon
            .stub(User, "findOne")
            .withArgs(sinon.match({ email: req.body.email }))
            .resolves(null);
        sinon.stub(bcrypt, "genSalt").resolves("mockedSalt");
        sinon.stub(bcrypt, "hash").resolves("hashedPassword");
        UserMock.expects("create").once().resolves(mockUser);
        sinon.stub(mockUser, "save").resolves(mockUser);
        sinon.stub(mockUser, "generateAuthToken").returns("mockedToken");

        for (const middleware of register) {
            await middleware(req as Request, res as Response, next);
        }

        expect(res.status).to.have.been.calledWith(201);
        expect(res.send).to.have.been.calledWith(
            sinon.match({
                acknowledged: true,
                token: "mockedToken",
                username: mockUser.name,
                message: "User created successfully",
            })
        );
        UserMock.verify();
    });
});

describe("login", () => {
    it("powinno zalogować użytkownika", async () => {
        req = {
            body: {
                email: "mock@gmail.com",
                password: "Mock123!",
            },
        };

        const mockUser: any = new User({
            email: "mock@gmail.com",
            password: "hashedPassword",
        });

        UserMock.expects("findOne")
            .withArgs(sinon.match({ email: req.body.email }))
            .resolves(mockUser);
        sinon
            .stub(bcrypt, "compare")
            .withArgs(req.body.password, mockUser.password)
            .resolves(true);
        sinon.stub(mockUser, "generateAuthToken").returns("mockedToken");

        for (const middleware of login) {
            await middleware(req as Request, res as Response, next);
        }

        expect(res.status).to.have.been.calledWith(200);
        expect(res.send).to.have.been.calledWith(
            sinon.match({
                token: "mockedToken",
                username: mockUser.name,
                message: "logged in successfully",
            })
        );
        UserMock.verify();
    });
});
