import * as sinon from "sinon";
import * as chai from "chai";
import sinonChai from "sinon-chai";
import WorkFromAPI from "../../models/workFromAPI.js";
import WorkInstance from "../../models/workInstance.js";
import { Request, Response } from "express";
import {
    createOne,
    updateOne,
    deleteOne,
    getOne,
} from "../../controllers/workFromAPI.js";

chai.use(sinonChai);

const expect = chai.expect;

let req: Partial<Request | any>;
let res: Partial<Response>;
let next: sinon.SinonSpy;
let WorkFromAPIMock: sinon.SinonMock;
let WorkInstanceMock: sinon.SinonMock;

beforeEach(() => {
    WorkFromAPIMock = sinon.mock(WorkFromAPI);
    WorkInstanceMock = sinon.mock(WorkInstance);
    res = { json: sinon.spy(), status: sinon.stub().returnsThis() };
    next = sinon.spy();
});
afterEach(() => {
    sinon.restore();
});

describe("createOne", () => {
    it("powinno stworzyć dzieło", async () => {
        req = {
            body: {
                api_id: "123",
                title: "Test",
                type: "book",
            },
            auth: { _id: "654ec8d1875ad4c13456f64a" },
        };

        const mockWorkCreateResponse = {
            _id: "507f191e810c19729de860ea",
            ...req.body,
            save: async () => null,
        };

        WorkFromAPIMock.expects("create")
            .once()
            .resolves(mockWorkCreateResponse);

        for (const middleware of createOne) {
            await middleware(req as Request, res as Response, next);
        }

        expect(res.json).to.have.been.calledWith({
            acknowledged: true,
            created: mockWorkCreateResponse,
        });
        WorkFromAPIMock.verify();
    });

    it("nie powinno stworzyć dzieła (błąd walidacji)", async () => {
        req = {
            body: {
                api_id: "123",
                title: 4,
                type: "Error",
            },
            auth: { _id: "654ec8d1875ad4c13456f64a" },
        };

        for (const middleware of createOne) {
            await middleware(req as Request, res, next);
        }

        expect(res.status).to.have.been.calledWith(422);
        expect(res.json).to.have.been.calledWith({
            acknowledged: false,
            errors: [
                {
                    type: "field",
                    value: 4,
                    msg: "Invalid value",
                    path: "title",
                    location: "body",
                },
                {
                    type: "field",
                    value: "Error",
                    msg: "Type must be one of 'movie', 'book' or 'game'",
                    path: "type",
                    location: "body",
                },
            ],
        });
        WorkFromAPIMock.verify();
    });

    it("nie powinno stworzyć dzieła (brak danych)", async () => {
        req = {
            body: {},
            auth: { _id: "654ec8d1875ad4c13456f64a" },
        };

        for (const middleware of createOne) {
            await middleware(req as Request, res, next);
        }

        expect(res.status).to.have.been.calledWith(422);
        expect(res.json).to.have.been.calledWith({
            acknowledged: false,
            errors: [
                {
                    type: "field",
                    value: undefined,
                    msg: "Missing api_id string",
                    path: "api_id",
                    location: "body",
                },
                {
                    type: "field",
                    value: undefined,
                    msg: "Invalid value",
                    path: "title",
                    location: "body",
                },
                {
                    type: "field",
                    value: undefined,
                    msg: "Missing type string",
                    path: "type",
                    location: "body",
                },
                {
                    type: "field",
                    value: "",
                    msg: "Type must be one of 'movie', 'book' or 'game'",
                    path: "type",
                    location: "body",
                },
            ],
        });
        WorkFromAPIMock.verify();
    });
});

describe("updateOne", () => {
    it("powinno zaktualizować dzieło", async () => {
        req = {
            params: { id: "507f191e810c19729de860ea" },
            body: {
                api_id: "123",
                title: "Test updated",
                type: "book",
            },
            auth: { _id: "654ec8d1875ad4c13456f64a" },
        };

        const mockUpdatedWork = {
            _id: req.params.id,
            ...req.body,
        };
        WorkFromAPIMock.expects("findByIdAndUpdate")
            .once()
            .withArgs(req.params.id, req.body)
            .resolves(mockUpdatedWork);

        for (const middleware of updateOne) {
            await middleware(req as Request, res as Response, next);
        }

        expect(res.json).to.have.been.calledWith({
            acknowledged: true,
            updated: mockUpdatedWork,
        });
        WorkFromAPIMock.verify();
    });
});

describe("deleteOne", () => {
    it("powinno usunąć dzieło", async () => {
        req = {
            params: { id: "507f191e810c19729de860ea" },
            auth: { _id: "654ec8d1875ad4c13456f64a" },
        };

        const mockWorkToDelete = {
            _id: req.params.id,
            api_id: "123",
            title: "Test",
            type: "book",
        };

        WorkFromAPIMock.expects("findById")
            .withArgs(req.params.id)
            .resolves(mockWorkToDelete);

        WorkInstanceMock.expects("deleteMany")
            .withArgs({ work_id: req.params.id })
            .resolves({ deletedCount: 1 });

        WorkFromAPIMock.expects("findByIdAndRemove")
            .withArgs(req.params.id)
            .resolves(mockWorkToDelete);

        for (const middleware of deleteOne) {
            await middleware(req as Request, res, next);
        }

        expect(res.status).to.not.have.been.calledWith(404);
        expect(res.json).to.have.been.calledWith({
            acknowledged: true,
            deleted: {
                workInstancesCount: 1,
                work: mockWorkToDelete,
            },
        });

        WorkFromAPIMock.verify();
        WorkInstanceMock.verify();
    });

    it("nie powinno usunąć dzieła (takie dzieło nie istnieje)", async () => {
        req = {
            params: { id: "507f191e810c19729de860eb" },
            auth: { _id: "654ec8d1875ad4c13456f64a" },
        };

        WorkFromAPIMock.expects("findById")
            .withArgs(req.params.id)
            .resolves(null);

        for (const middleware of deleteOne) {
            await middleware(req as Request, res, next);
        }

        expect(res.status).to.have.been.calledWith(404);
        expect(res.json).to.have.been.calledWith({
            error: "This work does not exist.",
        });

        WorkFromAPIMock.verify();
    });
});

describe("getOne", () => {
    it("powinno zwrócić dzieło", async () => {
        req = {
            params: { id: "507f191e810c19729de860ea" },
            auth: { _id: "654ec8d1875ad4c13456f64a" },
        };

        const mockWorkToGet = {
            _id: req.params.id,
            api_id: "123",
            title: "Test",
            type: "book",
        };

        const findByIdStub: sinon.SinonStub<any> = sinon.stub(
            WorkFromAPI,
            "findById"
        ) as any;
        const chainableStub: any = {
            exec: sinon.stub().resolves(mockWorkToGet),
        };

        findByIdStub.withArgs(req.params.id).returns(chainableStub);

        for (const middleware of getOne) {
            await middleware(req as Request, res, next);
        }

        expect(res.status).to.not.have.been.calledWith(404);
        expect(res.json).to.have.been.calledWith({ data: mockWorkToGet });

        WorkFromAPIMock.verify();
    });

    it("powinno nie zwrócić dzieła (takie dzieło nie istnieje)", async () => {
        req = {
            params: { id: "507f191e810c19729de860ea" },
            auth: { _id: "654ec8d1875ad4c13456f64a" },
        };

        const findByIdStub: sinon.SinonStub<any> = sinon.stub(
            WorkFromAPI,
            "findById"
        ) as any;
        const chainableStub: any = {
            exec: sinon.stub().resolves(null),
        };

        findByIdStub.withArgs(req.params.id).returns(chainableStub);

        for (const middleware of getOne) {
            await middleware(req as Request, res, next);
        }

        expect(res.status).to.have.been.calledWith(404);
        expect(res.json).to.have.been.calledWith({
            error: "This work does not exist.",
        });

        WorkFromAPIMock.verify();
    });
});
