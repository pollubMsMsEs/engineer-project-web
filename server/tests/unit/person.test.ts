import * as sinon from "sinon";
import * as chai from "chai";
import sinonChai from "sinon-chai";
import Person from "../../models/person.js";
import Work from "../../models/work.js";
import { Request, Response } from "express";
import {
    createOne,
    updateOne,
    deleteOne,
    getOne,
    getCount,
} from "../../controllers/person.js";

chai.use(sinonChai);

const expect = chai.expect;

let req: Partial<Request | any>;
let res: Partial<Response>;
let next: sinon.SinonSpy;
let PersonMock: sinon.SinonMock;

beforeEach(() => {
    PersonMock = sinon.mock(Person);

    res = { json: sinon.spy(), status: sinon.stub().returnsThis() };
    next = sinon.spy();
});
afterEach(() => {
    sinon.restore();
});

describe("createOne", () => {
    it("powinno stworzyć osobę", async () => {
        req = {
            body: {
                name: "Name",
                nick: "Nick",
                surname: "Surname",
            },
        };

        const mockPersonCreateResponse = {
            _id: "507f191e810c19729de860ea",
            ...req.body,
            save: async () => null,
        };

        PersonMock.expects("create").once().resolves(mockPersonCreateResponse);

        for (const middleware of createOne) {
            await middleware(req as Request, res as Response, next);
        }

        expect(res.json).to.have.been.calledWith({
            acknowledged: true,
            created: mockPersonCreateResponse,
        });
        PersonMock.verify();
    });
});

describe("updateOne", () => {
    it("powinno zaktualizować osobę", async () => {
        req = {
            params: { id: "507f191e810c19729de860ea" },
            body: {
                name: "Name",
                nick: "Nick updated",
                surname: "Surname",
            },
        };

        const mockUpdatedPerson = {
            _id: req.params.id,
            ...req.body,
        };
        PersonMock.expects("findByIdAndUpdate")
            .once()
            .withArgs(req.params.id, req.body)
            .resolves(mockUpdatedPerson);

        for (const middleware of updateOne) {
            await middleware(req as Request, res as Response, next);
        }

        expect(res.json).to.have.been.calledWith({
            acknowledged: true,
            updated: mockUpdatedPerson,
        });
        PersonMock.verify();
    });
});

describe("deleteOne", () => {
    it("powinno usunąć osobę", async () => {
        req = {
            params: { id: "507f191e810c19729de860ea" },
        };

        const mockPersonToDelete = {
            _id: req.params.id,
            name: "Name",
            nick: "Nick",
            surname: "Surname",
        };

        const findOneStub: sinon.SinonStub<any> = sinon.stub(
            Work,
            "findOne"
        ) as any;
        const chainableStub: any = {
            exec: sinon.stub().resolves(null),
        };

        findOneStub.returns(chainableStub);

        PersonMock.expects("findByIdAndRemove")
            .withArgs(req.params.id)
            .resolves(mockPersonToDelete);

        for (const middleware of deleteOne) {
            await middleware(req as Request, res, next);
        }

        expect(res.json).to.have.been.calledWith({
            acknowledged: true,
            deleted: mockPersonToDelete,
        });

        PersonMock.verify();
        findOneStub.restore();
    });
});

describe("getOne", () => {
    it("powinno zwrócić osobę", async () => {
        req = {
            params: { id: "507f191e810c19729de860ea" },
        };

        const mockPersonToGet = {
            _id: req.params.id,
            name: "Name",
            nick: "Nick",
            surname: "Surname",
        };

        const findByIdStub: sinon.SinonStub<any> = sinon.stub(
            Person,
            "findById"
        ) as any;
        const chainableStub: any = {
            populate: sinon.stub().returnsThis(),
            exec: sinon.stub().resolves(mockPersonToGet),
        };

        findByIdStub.withArgs(req.params.id).returns(chainableStub);

        for (const middleware of getOne) {
            await middleware(req as Request, res, next);
        }

        expect(res.status).to.not.have.been.calledWith(404);
        expect(res.json).to.have.been.calledWith({ data: mockPersonToGet });

        PersonMock.verify();
    });

    it("powinno nie zwrócić osoby (taka osoba nie istnieje)", async () => {
        req = {
            params: { id: "507f191e810c19729de860ea" },
        };

        const findByIdStub: sinon.SinonStub<any> = sinon.stub(
            Person,
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
            error: "This person does not exist.",
        });

        PersonMock.verify();
    });
});

describe("getCount", () => {
    it("powinno zwrócić liczbę osób", async () => {
        req = {};
        const mockCount = 4;
        const countStub = sinon.stub(Person, "count").resolves(mockCount);

        await getCount(req as Request, res as Response);

        expect(res.status).to.not.have.been.calledWith(404);
        expect(res.json).to.have.been.calledWith({ count: mockCount });

        countStub.restore();
    });
});
