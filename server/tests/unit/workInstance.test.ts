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
} from "../../controllers/workInstance.js";

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
    it("powinno stworzyć instancję dzieła", async () => {
        req = {
            body: {
                work_id: "765fd8d1875ad4c98765f64b",
                onModel: "Work",
                rating: 5,
                description: "Opis",
                completions: [],
                number_of_completions: 4,
                status: "todo",
                began_at: "2021-01-01T10:00:00Z",
                finished_at: "2021-01-01T10:00:00Z",
                metadata: {
                    "<script></script>": "<p>",
                },
            },
            auth: { _id: "654ec8d1875ad4c13456f64a" },
        };

        const mockWork = {
            _id: "765fd8d1875ad4c98765f64b",
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

        const mockWorkInstance = {
            _id: "507f191e810c19729de860ea",
            user_id: req.auth._id,
            ...req.body,
            save: async () => null,
        };

        const mockPopulatedWorkInstance = {
            _id: "507f191e810c19729de860ea",
            user_id: req.auth._id,
            work_id: {
                ...mockWork,
            },
            onModel: "Work",
            rating: 5,
            description: "Opis",
            completions: [],
            number_of_completions: 4,
            status: "todo",
            began_at: "2021-01-01T10:00:00Z",
            finished_at: "2021-01-01T10:00:00Z",
            metadata: {
                "<script></script>": "<p>",
            },
        };

        WorkMock.expects("findById")
            .withArgs(req.body.work_id)
            .resolves(mockWork);

        WorkInstanceMock.expects("findOne")
            .withArgs(
                sinon.match({
                    work_id: req.body.work_id,
                    user_id: req.auth._id,
                })
            )
            .resolves(null);

        WorkInstanceMock.expects("create").once().resolves(mockWorkInstance);

        const findByIdStub: sinon.SinonStub<any> = sinon.stub(
            WorkInstance,
            "findById"
        ) as any;
        const chainableStub: any = {
            populate: sinon.stub().returnsThis(),
            exec: sinon.stub().resolves(mockPopulatedWorkInstance),
        };

        findByIdStub.withArgs(mockWorkInstance._id).returns(chainableStub);

        for (const middleware of createOne) {
            await middleware(req as Request, res as Response, next);
        }

        expect(res.json).to.have.been.calledWith({
            acknowledged: true,
            created: mockPopulatedWorkInstance,
        });

        WorkMock.verify();
        WorkInstanceMock.verify();
        findByIdStub.restore();
    });

    it("nie powinno stworzyć dzieła (błąd walidacji)", async () => {
        req = {
            body: {
                work_id: "765fd8d1875ad4c98765f64b",
                onModel: "Error",
                rating: "Error",
                description: "Opis",
                completions: [],
                number_of_completions: 4,
                status: "todo",
                began_at: "2021-01-01T10:00:00Z",
                finished_at: "2021-01-01T10:00:00Z",
                metadata: {
                    "<script></script>": "<p>",
                },
            },
            auth: { _id: "654ec8d1875ad4c13456f64a" },
        };

        for (const middleware of createOne) {
            await middleware(req as Request, res as Response, next);
        }

        expect(res.status).to.have.been.calledWith(422);
        expect(res.json).to.have.been.calledWith({
            acknowledged: false,
            errors: [
                {
                    type: "field",
                    value: "Error",
                    msg: "OnModel must be one of 'Work' or 'WorkFromAPI'",
                    path: "onModel",
                    location: "body",
                },
                {
                    type: "field",
                    value: "Error",
                    msg: "Rating must be an integer number between 0 and 10",
                    path: "rating",
                    location: "body",
                },
            ],
        });

        WorkInstanceMock.verify();
    });

    it("nie powinno stworzyć dzieła (brak danych)", async () => {
        req = {
            body: {},
            auth: { _id: "654ec8d1875ad4c13456f64a" },
        };

        for (const middleware of createOne) {
            await middleware(req as Request, res as Response, next);
        }

        expect(res.status).to.have.been.calledWith(422);
        expect(res.json).to.have.been.calledWith({
            acknowledged: false,
            errors: [
                {
                    type: "field",
                    value: undefined,
                    msg: "This value isn't ObjectID",
                    path: "work_id",
                    location: "body",
                },
                {
                    type: "field",
                    value: undefined,
                    msg: "Missing onModel string",
                    path: "onModel",
                    location: "body",
                },
                {
                    type: "field",
                    value: "",
                    msg: "OnModel must be one of 'Work' or 'WorkFromAPI'",
                    path: "onModel",
                    location: "body",
                },
                {
                    type: "field",
                    value: undefined,
                    msg: "Completions must be an array",
                    path: "completions",
                    location: "body",
                },
                {
                    type: "field",
                    value: undefined,
                    msg: "Number_of_completions must match or be greater than the length of the completions array",
                    path: "number_of_completions",
                    location: "body",
                },
            ],
        });

        WorkInstanceMock.verify();
    });
});

describe("updateOne", () => {
    it("powinno zaktualizować dzieło", async () => {
        req = {
            params: { id: "507f191e810c19729de860ea" },
            body: {
                work_id: "765fd8d1875ad4c98765f64b",
                onModel: "Work",
                rating: 5,
                description: "Opis updated",
                completions: [],
                number_of_completions: 5,
                status: "completed",
            },
            auth: { _id: "654ec8d1875ad4c13456f64a" },
        };

        const mockWork = {
            _id: "765fd8d1875ad4c98765f64b",
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

        const mockWorkInstanceBeforeUpdate = {
            _id: "507f191e810c19729de860ea",
            user_id: req.auth._id,
            work_id: "765fd8d1875ad4c98765f64b",
            onModel: "Work",
            rating: 5,
            description: "Opis",
            completions: [],
            number_of_completions: 4,
            status: "todo",
            type: "book",
            from_api: false,
        };

        const mockPopulatedWorkInstance = {
            _id: "507f191e810c19729de860ea",
            user_id: req.auth._id,
            work_id: {
                ...mockWork,
            },
            onModel: "Work",
            rating: 5,
            description: "Opis updated",
            completions: [],
            number_of_completions: 5,
            status: "completed",
            type: "book",
            from_api: false,
        };

        WorkInstanceMock.expects("findById")
            .withArgs(req.params.id)
            .resolves(mockWorkInstanceBeforeUpdate);

        WorkMock.expects("findById")
            .withArgs(req.body.work_id)
            .resolves(mockWork);

        const findByIdAndUpdateStub: sinon.SinonStub<any> = sinon.stub(
            WorkInstance,
            "findByIdAndUpdate"
        ) as any;
        const chainableStub: any = {
            populate: sinon.stub().returnsThis(),
            exec: sinon.stub().resolves(mockPopulatedWorkInstance),
        };

        findByIdAndUpdateStub
            .withArgs(req.params.id, sinon.match.any, sinon.match.any)
            .returns(chainableStub);

        for (const middleware of updateOne) {
            await middleware(req as Request, res as Response, next);
        }

        expect(res.json).to.have.been.calledWith({
            acknowledged: true,
            updated: mockPopulatedWorkInstance,
        });

        WorkMock.verify();
        WorkInstanceMock.verify();
        findByIdAndUpdateStub.restore();
    });
});

describe("deleteOne", () => {
    it("powinno usunąć dzieło", async () => {
        req = {
            params: { id: "507f191e810c19729de860ea" },
            auth: { _id: "654ec8d1875ad4c13456f64a" },
        };

        const mockWorkInstanceToDelete = {
            _id: req.params.id,
            user_id: "654ec8d1875ad4c13456f64a",
            work_id: "765fd8d1875ad4c98765f64b",
            onModel: "Work",
            rating: 5,
            description: "Opis",
            completions: [],
            number_of_completions: 4,
            status: "todo",
            type: "book",
            from_api: false,
        };

        const mockPopulatedWorkInstance = {
            _id: req.params.id,
            user_id: "654ec8d1875ad4c13456f64a",
            work_id: {
                _id: "765fd8d1875ad4c98765f64b",
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
            },
            onModel: "Work",
            rating: 5,
            description: "Opis updated",
            completions: [],
            number_of_completions: 5,
            status: "completed",
            type: "book",
            from_api: false,
        };

        WorkInstanceMock.expects("findById")
            .withArgs(req.params.id)
            .resolves(mockWorkInstanceToDelete);

        const findByIdAndRemoveStub: sinon.SinonStub<any> = sinon.stub(
            WorkInstance,
            "findByIdAndRemove"
        ) as any;
        const chainableStub: any = {
            populate: sinon.stub().returnsThis(),
            exec: sinon.stub().resolves(mockPopulatedWorkInstance),
        };

        findByIdAndRemoveStub.withArgs(req.params.id).returns(chainableStub);

        for (const middleware of deleteOne) {
            await middleware(req as Request, res, next);
        }

        expect(res.status).to.not.have.been.calledWith(404);
        expect(res.json).to.have.been.calledWith({
            acknowledged: true,
            deleted: mockPopulatedWorkInstance,
        });

        WorkInstanceMock.verify();
        findByIdAndRemoveStub.restore();
    });

    it("nie powinno usunąć dzieła (takie dzieło nie istnieje)", async () => {
        req = {
            params: { id: "507f191e810c19729de860eb" },
            auth: { _id: "654ec8d1875ad4c13456f64a" },
        };

        WorkInstanceMock.expects("findById")
            .withArgs(req.params.id)
            .resolves(null);

        for (const middleware of deleteOne) {
            await middleware(req as Request, res, next);
        }

        expect(res.status).to.have.been.calledWith(404);
        expect(res.json).to.have.been.calledWith({
            error: "This work instance does not exist.",
        });

        WorkInstanceMock.verify();
    });
});

describe("getOne", () => {
    it("powinno zwrócić dzieło", async () => {
        req = {
            params: { id: "507f191e810c19729de860ea" },
            auth: { _id: "654ec8d1875ad4c13456f64a" },
        };

        const mockWorkInstanceToGet = {
            _id: req.params.id,
            created_by: "654ec8d1875ad4c13456f64a",
            work_id: {
                _id: "765fd8d1875ad4c98765f64b",
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
            },
            onModel: "Work",
            rating: 5,
            description: "Opis updated",
            completions: [],
            number_of_completions: 5,
            status: "completed",
            type: "book",
            from_api: false,
        };

        const findByIdStub: sinon.SinonStub<any> = sinon.stub(
            WorkInstance,
            "findById"
        ) as any;
        const chainableStub: any = {
            populate: sinon.stub().returnsThis(),
            exec: sinon.stub().resolves(mockWorkInstanceToGet),
        };

        findByIdStub.withArgs(req.params.id).returns(chainableStub);

        for (const middleware of getOne) {
            await middleware(req as Request, res, next);
        }

        expect(res.status).to.not.have.been.calledWith(404);
        expect(res.json).to.have.been.calledWith({
            data: mockWorkInstanceToGet,
        });

        findByIdStub.restore();
    });

    it("powinno nie zwrócić dzieła (takie dzieło nie istnieje)", async () => {
        req = {
            params: { id: "507f191e810c19729de860ea" },
            auth: { _id: "654ec8d1875ad4c13456f64a" },
        };

        const findByIdStub: sinon.SinonStub<any> = sinon.stub(
            WorkInstance,
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
            error: "This work instance does not exist.",
        });

        findByIdStub.restore();
    });
});
