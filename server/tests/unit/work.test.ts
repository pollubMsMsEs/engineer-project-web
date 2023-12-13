import * as sinon from "sinon";
import * as chai from "chai";
import sinonChai from "sinon-chai";
import Work from "../../models/work.js";
import WorkInstance from "../../models/workInstance.js";
import { Request, Response } from "express";
import {
    createOne,
    updateOne,
    deleteOne,
    getOne,
    getCount,
} from "../../controllers/work.js";

chai.use(sinonChai);

const expect = chai.expect;

let req: Partial<Request | any>;
let res: Partial<Response>;
let next: sinon.SinonSpy;
let WorkMock: sinon.SinonMock;
let WorkInstanceMock: sinon.SinonMock;

beforeEach(() => {
    WorkMock = sinon.mock(Work);
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
                title: "Test",
                description: "Opis",
                published_at: "2022-04-05",
                genres: ["<script></script>"],
                metadata: {
                    "<script></script>": "<p>",
                },
                people: [],
                type: "book",
            },
            auth: { _id: "654ec8d1875ad4c13456f64a" },
        };

        const mockWorkCreateResponse = {
            _id: "507f191e810c19729de860ea",
            created_by: req.auth._id,
            ...req.body,
            save: async () => null,
        };

        WorkMock.expects("create").once().resolves(mockWorkCreateResponse);

        for (const middleware of createOne) {
            await middleware(req as Request, res as Response, next);
        }

        expect(res.json).to.have.been.calledWith({
            acknowledged: true,
            created: mockWorkCreateResponse,
        });
        WorkMock.verify();
    });

    it("nie powinno stworzyć dzieła (błąd walidacji)", async () => {
        req = {
            body: {
                title: "Test",
                published_at: "error",
                genres: ["<script></script>"],
                metadata: {
                    "<script></script>": "<p>",
                },
                type: "error",
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
                    value: "error",
                    msg: "Incorrect format of published_at date",
                    path: "published_at",
                    location: "body",
                },
                {
                    type: "field",
                    value: "error",
                    msg: "Type must be one of 'movie', 'book' or 'game'",
                    path: "type",
                    location: "body",
                },
            ],
        });
        WorkMock.verify();
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
                    value: "",
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
        WorkMock.verify();
    });
});

describe("updateOne", () => {
    it("powinno zaktualizować dzieło", async () => {
        req = {
            params: { id: "507f191e810c19729de860ea" },
            body: {
                title: "Test updated",
                description: "Opis updated",
                published_at: "2022-04-06",
                genres: ["<script></script>"],
                metadata: {
                    "<script></script>": "<p>",
                },
                people: [],
                type: "book",
            },
            auth: { _id: "654ec8d1875ad4c13456f64a" },
        };

        const mockUpdatedWork = {
            _id: req.params.id,
            created_by: req.auth._id,
            ...req.body,
        };
        WorkMock.expects("findByIdAndUpdate")
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
        WorkMock.verify();
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
            created_by: "654ec8d1875ad4c13456f64a",
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

        WorkMock.expects("findById")
            .withArgs(req.params.id)
            .resolves(mockWorkToDelete);

        WorkInstanceMock.expects("deleteMany")
            .withArgs({ work_id: req.params.id })
            .resolves({ deletedCount: 1 });

        WorkMock.expects("findByIdAndRemove")
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

        WorkMock.verify();
        WorkInstanceMock.verify();
    });

    it("nie powinno usunąć dzieła (takie dzieło nie istnieje)", async () => {
        req = {
            params: { id: "507f191e810c19729de860eb" },
            auth: { _id: "654ec8d1875ad4c13456f64a" },
        };

        WorkMock.expects("findById").withArgs(req.params.id).resolves(null);

        for (const middleware of deleteOne) {
            await middleware(req as Request, res, next);
        }

        expect(res.status).to.have.been.calledWith(404);
        expect(res.json).to.have.been.calledWith({
            error: "This work does not exist.",
        });

        WorkMock.verify();
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
            created_by: "654ec8d1875ad4c13456f64a",
            title: "Test",
            description: "Opis",
            published_at: "2022-04-05",
            genres: ["<script></script>"],
            metadata: {
                "<script></script>": "<p>",
            },
            type: "book",
        };

        const findByIdStub: sinon.SinonStub<any> = sinon.stub(
            Work,
            "findById"
        ) as any;
        const chainableStub: any = {
            populate: sinon.stub().returnsThis(),
            exec: sinon.stub().resolves(mockWorkToGet),
        };

        findByIdStub.withArgs(req.params.id).returns(chainableStub);

        for (const middleware of getOne) {
            await middleware(req as Request, res, next);
        }

        expect(res.status).to.not.have.been.calledWith(404);
        expect(res.json).to.have.been.calledWith({ data: mockWorkToGet });

        findByIdStub.restore();
    });

    it("powinno nie zwrócić dzieła (takie dzieło nie istnieje)", async () => {
        req = {
            params: { id: "507f191e810c19729de860ea" },
            auth: { _id: "654ec8d1875ad4c13456f64a" },
        };

        const findByIdStub: sinon.SinonStub<any> = sinon.stub(
            Work,
            "findById"
        ) as any;
        const chainableStub: any = {
            populate: sinon.stub().returnsThis(),
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

        findByIdStub.restore();
    });
});

describe("getCount", () => {
    it("powinno zwrócić liczbę dzieł", async () => {
        req = {};
        const mockCount = 4;
        const countStub = sinon.stub(Work, "count").resolves(mockCount);

        await getCount(req as Request, res as Response);

        expect(res.status).to.not.have.been.calledWith(404);
        expect(res.json).to.have.been.calledWith({ count: mockCount });

        countStub.restore();
    });
});
