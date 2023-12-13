import * as sinon from "sinon";
import * as chai from "chai";
import sinonChai from "sinon-chai";
import Image from "../../models/image.js";
import { NextFunction, Request, Response } from "express";
import {
    createOne,
    updateOne,
    deleteOne,
    getOne,
    getCount,
} from "../../controllers/image.js";

chai.use(sinonChai);

const expect = chai.expect;

let req: Partial<Request | any>;
let res: Partial<Response>;
let next: sinon.SinonSpy;
let ImageMock: sinon.SinonMock;

beforeEach(() => {
    ImageMock = sinon.mock(Image);

    res = { json: sinon.spy(), status: sinon.stub().returnsThis() };
    next = sinon.spy();
});
afterEach(() => {
    sinon.restore();
});

describe("createOne", () => {
    it("powinno stworzyć obraz", async () => {
        req = {
            file: {
                mimetype: "image/png",
                buffer: Buffer.from("mock image data", "utf-8"),
            },
            protocol: "http",
            get: jest.fn().mockReturnValue("localhost:7777"),
            headers: {
                "transfer-encoding": "chunked",
            },
        };

        const mockImageCreateResponse = {
            _id: "507f191e810c19729de860ea",
            type: req.file.mimetype,
            save: async () => null,
        };

        ImageMock.expects("create").once().resolves(mockImageCreateResponse);

        for (const middleware of createOne) {
            if (middleware.length === 4) {
                const errorHandler = middleware as (
                    err: any,
                    req: Request,
                    res: Response,
                    next: NextFunction
                ) => void;
                errorHandler(null, req as Request, res as Response, next);
            } else {
                const regularMiddleware = middleware as (
                    req: Request,
                    res: Response,
                    next: NextFunction
                ) => Promise<void>;
                await regularMiddleware(req as Request, res as Response, next);
            }
        }

        expect(res.json).to.have.been.calledWith({
            acknowledged: true,
            created: `${req.protocol}://${req.get("host")}/api/image/${
                mockImageCreateResponse._id
            }`,
        });
        ImageMock.verify();
    });

    it("nie powinno stworzyć obrazu (plik nie jest obrazem)", async () => {
        req = {
            file: {
                mimetype: "application/pdf",
                buffer: Buffer.from("mock image data", "utf-8"),
            },
            protocol: "http",
            get: jest.fn().mockReturnValue("localhost:7777"),
            headers: {
                "transfer-encoding": "chunked",
            },
        };

        for (const middleware of createOne) {
            if (middleware.length === 4) {
                const errorHandler = middleware as (
                    err: any,
                    req: Request,
                    res: Response,
                    next: NextFunction
                ) => void;
                errorHandler(null, req as Request, res as Response, next);
            } else {
                const regularMiddleware = middleware as (
                    req: Request,
                    res: Response,
                    next: NextFunction
                ) => Promise<void>;
                await regularMiddleware(req as Request, res as Response, next);
            }
        }

        expect(res.status).to.have.been.calledWith(400);
        expect(res.json).to.have.been.calledWith({
            acknowledged: false,
            message: "Uploaded file is not an image",
        });
    });

    it("nie powinno stworzyć obrazu (brak pliku)", async () => {
        req = {
            protocol: "http",
            get: jest.fn().mockReturnValue("localhost:7777"),
            headers: {
                "transfer-encoding": "chunked",
            },
        };

        for (const middleware of createOne) {
            if (middleware.length === 4) {
                const errorHandler = middleware as (
                    err: any,
                    req: Request,
                    res: Response,
                    next: NextFunction
                ) => void;
                errorHandler(null, req as Request, res as Response, next);
            } else {
                const regularMiddleware = middleware as (
                    req: Request,
                    res: Response,
                    next: NextFunction
                ) => Promise<void>;
                await regularMiddleware(req as Request, res as Response, next);
            }
        }

        expect(res.status).to.have.been.calledWith(400);
        expect(res.json).to.have.been.calledWith({
            acknowledged: false,
            message: "No file uploaded",
        });
    });
});

describe("updateOne", () => {
    it("powinno zaktualizować obraz", async () => {
        req = {
            params: { id: "507f191e810c19729de860ea" },
            file: {
                mimetype: "image/png",
                buffer: Buffer.from("mock image data", "utf-8"),
            },
            protocol: "http",
            get: jest.fn().mockReturnValue("localhost:7777"),
            headers: {
                "transfer-encoding": "chunked",
            },
        };

        const mockImageUpdateResponse = {
            _id: req.params.id,
            image: `iVBORw0KGgoAAAANSUhEUgAAAA
                    gAAAAIAQMAAAD+wSzIAAAABlBM
                    VEX///+/v7+jQ3Y5AAAADklEQV
                    QI12P4AIX8EAgALgAD/aNpbtEA
                    AAAASUVORK5CYII=`,
            type: req.file.type,
        };
        ImageMock.expects("findByIdAndUpdate")
            .once()
            .withArgs(req.params.id, sinon.match.any)
            .resolves(mockImageUpdateResponse);

        for (const middleware of updateOne) {
            if (middleware.length === 4) {
                const errorHandler = middleware as (
                    err: any,
                    req: Request,
                    res: Response,
                    next: NextFunction
                ) => void;
                errorHandler(null, req as Request, res as Response, next);
            } else {
                const regularMiddleware = middleware as (
                    req: Request,
                    res: Response,
                    next: NextFunction
                ) => Promise<void>;
                await regularMiddleware(req as Request, res as Response, next);
            }
        }

        expect(res.json).to.have.been.calledWith({
            acknowledged: true,
            updated: `${req.protocol}://${req.get("host")}/api/image/${
                mockImageUpdateResponse._id
            }`,
        });
        ImageMock.verify();
    });
});

describe("deleteOne", () => {
    it("powinno usunąć obraz", async () => {
        req = {
            params: { id: "507f191e810c19729de860ea" },
        };

        const mockImageToDelete = {
            _id: req.params.id,
            image: `iVBORw0KGgoAAAANSUhEUgAAAA
                    gAAAAIAQMAAAD+wSzIAAAABlBM
                    VEX///+/v7+jQ3Y5AAAADklEQV
                    QI12P4AIX8EAgALgAD/aNpbtEA
                    AAAASUVORK5CYII=`,
            type: "image/png",
        };

        ImageMock.expects("findById")
            .withArgs(req.params.id)
            .resolves(mockImageToDelete);

        ImageMock.expects("findByIdAndRemove")
            .withArgs(req.params.id)
            .resolves(mockImageToDelete);

        for (const middleware of deleteOne) {
            await middleware(req as Request, res, next);
        }

        expect(res.status).to.not.have.been.calledWith(404);
        expect(res.json).to.have.been.calledWith({
            acknowledged: true,
            deleted: mockImageToDelete,
        });

        ImageMock.verify();
    });

    it("nie powinno usunąć obrazu (taki obraz nie istnieje)", async () => {
        req = {
            params: { id: "507f191e810c19729de860eb" },
        };

        ImageMock.expects("findById").withArgs(req.params.id).resolves(null);

        for (const middleware of deleteOne) {
            await middleware(req as Request, res, next);
        }

        expect(res.status).to.have.been.calledWith(404);
        expect(res.json).to.have.been.calledWith({
            error: "This image does not exist.",
        });

        ImageMock.verify();
    });
});

describe("getOne", () => {
    it("powinno zwrócić obraz", async () => {
        req = {
            params: { id: "507f191e810c19729de860ea" },
        };

        const mockImageToGet = {
            _id: req.params.id,
            image: `iVBORw0KGgoAAAANSUhEUgAAAA
                    gAAAAIAQMAAAD+wSzIAAAABlBM
                    VEX///+/v7+jQ3Y5AAAADklEQV
                    QI12P4AIX8EAgALgAD/aNpbtEA
                    AAAASUVORK5CYII=`,
            type: "image/png",
        };

        const findByIdStub: sinon.SinonStub<any> = sinon.stub(
            Image,
            "findById"
        ) as any;
        const chainableStub: any = {
            populate: sinon.stub().returnsThis(),
            exec: sinon.stub().resolves(mockImageToGet),
        };

        findByIdStub.withArgs(req.params.id).returns(chainableStub);

        for (const middleware of getOne) {
            await middleware(req as Request, res, next);
        }

        expect(res.status).to.not.have.been.calledWith(404);
        expect(res.json).to.have.been.calledWith({ data: mockImageToGet });

        findByIdStub.restore();
    });

    it("powinno nie zwrócić obrazu (taki obraz nie istnieje)", async () => {
        req = {
            params: { id: "507f191e810c19729de860ea" },
        };

        const findByIdStub: sinon.SinonStub<any> = sinon.stub(
            Image,
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
            error: "This image does not exist.",
        });

        findByIdStub.restore();
    });
});

describe("getCount", () => {
    it("powinno zwrócić liczbę obrazów", async () => {
        req = {};
        const mockCount = 4;
        const countStub = sinon.stub(Image, "count").resolves(mockCount);

        await getCount(req as Request, res as Response);

        expect(res.status).to.not.have.been.calledWith(404);
        expect(res.json).to.have.been.calledWith({ count: mockCount });

        countStub.restore();
    });
});
