import { handleReport } from "../../controllers/report.js";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import User from "../../models/user.js";
import Person from "../../models/person.js";
import Work from "../../models/work.js";
import WorkFromAPI from "../../models/workFromAPI.js";
import WorkInstance from "../../models/workInstance.js";
import createTestData from "./data/report.js";

let mongoServer: MongoMemoryServer;
let userId: any;
const oneDay = 86400000;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = await mongoServer.getUri();
    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    } as mongoose.ConnectOptions);
    userId = await createTestData();
});

afterAll(async () => {
    await User.deleteMany({});
    await Person.deleteMany({});
    await Work.deleteMany({});
    await WorkFromAPI.deleteMany({});
    await WorkInstance.deleteMany({});
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe("getAverageCompletionTime", () => {
    it("powinno zwrócić średni czas ukończenia dla wszystkich dzieł (bez query)", async () => {
        const req = {
            query: {},
            params: { reportType: "average_completion_time" },
            auth: {
                _id: userId,
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as any;

        res.json.mockImplementation((data: any) => {
            return { ...data };
        });

        await handleReport(req, res);

        const expected = oneDay * 2;

        expect(res.json).toHaveBeenCalledWith({
            acknowledged: true,
            average_completion_time: expected,
        });
    });

    it("powinno zwrócić średni czas ukończenia dla wszystkich dzieł (z query)", async () => {
        const req = {
            query: { type: "book,movie,game" },
            params: { reportType: "average_completion_time" },
            auth: {
                _id: userId,
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as any;

        res.json.mockImplementation((data: any) => {
            return { ...data };
        });

        await handleReport(req, res);

        const expected = oneDay * 2;

        expect(res.json).toHaveBeenCalledWith({
            acknowledged: true,
            average_completion_time: expected,
        });
    });
    it("powinno zwrócić średni czas ukończenia dla książek", async () => {
        const req = {
            query: { type: "book" },
            params: { reportType: "average_completion_time" },
            auth: {
                _id: userId,
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as any;

        res.json.mockImplementation((data: any) => {
            return { ...data };
        });

        await handleReport(req, res);

        const expected = oneDay;

        expect(res.json).toHaveBeenCalledWith({
            acknowledged: true,
            average_completion_time: expected,
        });
    });
    it("powinno zwrócić średni czas ukończenia dla filmów", async () => {
        const req = {
            query: { type: "movie" },
            params: { reportType: "average_completion_time" },
            auth: {
                _id: userId,
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as any;

        res.json.mockImplementation((data: any) => {
            return { ...data };
        });

        await handleReport(req, res);

        const expected = oneDay * 2;

        expect(res.json).toHaveBeenCalledWith({
            acknowledged: true,
            average_completion_time: expected,
        });
    });
    it("powinno zwrócić średni czas ukończenia dla gier", async () => {
        const req = {
            query: { type: "game" },
            params: { reportType: "average_completion_time" },
            auth: {
                _id: userId,
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as any;

        res.json.mockImplementation((data: any) => {
            return { ...data };
        });

        await handleReport(req, res);

        const expected = oneDay * 3;

        expect(res.json).toHaveBeenCalledWith({
            acknowledged: true,
            average_completion_time: expected,
        });
    });
    it("powinno zwrócić średni czas ukończenia dla wszystkich dzieł zawierających w tytule 'Title' (Wszystkie dzieła)", async () => {
        const req = {
            query: { title: "Title" },
            params: { reportType: "average_completion_time" },
            auth: {
                _id: userId,
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as any;

        res.json.mockImplementation((data: any) => {
            return { ...data };
        });

        await handleReport(req, res);

        const expected = oneDay * 2;

        expect(res.json).toHaveBeenCalledWith({
            acknowledged: true,
            average_completion_time: expected,
        });
    });
    it("powinno zwrócić średni czas ukończenia dla wszystkich dzieł zawierających w tytule 'tiTle1' (Jedno dzieło)", async () => {
        const req = {
            query: { title: "tiTle1" },
            params: { reportType: "average_completion_time" },
            auth: {
                _id: userId,
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as any;

        res.json.mockImplementation((data: any) => {
            return { ...data };
        });

        await handleReport(req, res);

        const expected = oneDay;

        expect(res.json).toHaveBeenCalledWith({
            acknowledged: true,
            average_completion_time: expected,
        });
    });
    it("powinno zwrócić średni czas ukończenia dla wszystkich dzieł zawierających personę 'naMe' (Wszystkie dzieła nie z API)", async () => {
        const req = {
            query: { person: "naMe" },
            params: { reportType: "average_completion_time" },
            auth: {
                _id: userId,
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as any;

        res.json.mockImplementation((data: any) => {
            return { ...data };
        });

        await handleReport(req, res);

        const expected = oneDay * 2;

        expect(res.json).toHaveBeenCalledWith({
            acknowledged: true,
            average_completion_time: expected,
        });
    });
    it("powinno zwrócić średni czas ukończenia dla wszystkich dzieł zawierających personę 'NAME1' (Work[0] i Work[2])", async () => {
        const req = {
            query: { person: "NAME1" },
            params: { reportType: "average_completion_time" },
            auth: {
                _id: userId,
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as any;

        res.json.mockImplementation((data: any) => {
            return { ...data };
        });

        await handleReport(req, res);

        const expected = oneDay * 2;

        expect(res.json).toHaveBeenCalledWith({
            acknowledged: true,
            average_completion_time: expected,
        });
    });
    it("powinno zwrócić średni czas ukończenia dla wszystkich dzieł zawierających personę 'NICK1' (Work[0] i Work[2])", async () => {
        const req = {
            query: { person: "NICK1" },
            params: { reportType: "average_completion_time" },
            auth: {
                _id: userId,
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as any;

        res.json.mockImplementation((data: any) => {
            return { ...data };
        });

        await handleReport(req, res);

        const expected = oneDay * 2;

        expect(res.json).toHaveBeenCalledWith({
            acknowledged: true,
            average_completion_time: expected,
        });
    });
    it("powinno zwrócić średni czas ukończenia dla wszystkich dzieł zawierających personę 'SURNAME2' (Work[1])", async () => {
        const req = {
            query: { person: "SURNAME2" },
            params: { reportType: "average_completion_time" },
            auth: {
                _id: userId,
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as any;

        res.json.mockImplementation((data: any) => {
            return { ...data };
        });

        await handleReport(req, res);

        const expected = oneDay * 2;

        expect(res.json).toHaveBeenCalledWith({
            acknowledged: true,
            average_completion_time: expected,
        });
    });
    it("powinno zwrócić średni czas ukończenia dla wszystkich książek zawierających w tytule 'tiTle1' oraz personę 'SURNAME1'  (Work[0])", async () => {
        const req = {
            query: {
                type: "book",
                title: "tiTle1",
                person: "SURNAME1",
            },
            params: { reportType: "average_completion_time" },
            auth: {
                _id: userId,
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as any;

        res.json.mockImplementation((data: any) => {
            return { ...data };
        });

        await handleReport(req, res);

        const expected = oneDay;

        expect(res.json).toHaveBeenCalledWith({
            acknowledged: true,
            average_completion_time: expected,
        });
    });
    it("powinno zwrócić średni czas ukończenia dla wszystkich książek zawierających w tytule 'tiTle1' oraz personę 'SURNAME2'  (Brak dzieł)", async () => {
        const req = {
            query: {
                type: "book",
                title: "tiTle1",
                person: "SURNAME2",
            },
            params: { reportType: "average_completion_time" },
            auth: {
                _id: userId,
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as any;

        res.json.mockImplementation((data: any) => {
            return { ...data };
        });

        await handleReport(req, res);

        const expected = 0;

        expect(res.json).toHaveBeenCalledWith({
            acknowledged: true,
            average_completion_time: expected,
        });
    });
});

describe("getAverageRating", () => {
    it("powinno zwrócić średnią ocenę dla wszystkich dzieł (bez query)", async () => {
        const req = {
            query: {},
            params: { reportType: "average_rating" },
            auth: {
                _id: userId,
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as any;

        res.json.mockImplementation((data: any) => {
            return { ...data };
        });

        await handleReport(req, res);

        const expected = 3.5;

        expect(res.json).toHaveBeenCalledWith({
            acknowledged: true,
            average_rating: expected,
        });
    });
    it("powinno zwrócić średnią ocenę dla wszystkich dzieł (z query)", async () => {
        const req = {
            query: { type: "book,movie,game" },
            params: { reportType: "average_rating" },
            auth: {
                _id: userId,
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as any;

        res.json.mockImplementation((data: any) => {
            return { ...data };
        });

        await handleReport(req, res);

        const expected = 3.5;

        expect(res.json).toHaveBeenCalledWith({
            acknowledged: true,
            average_rating: expected,
        });
    });
});

describe("getCountByType", () => {
    it("powinno zwrócić liczbę dzieł według typu (bez query)", async () => {
        const req = {
            query: {},
            params: { reportType: "count_by_type" },
            auth: {
                _id: userId,
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as any;

        res.json.mockImplementation((data: any) => {
            return { ...data };
        });

        await handleReport(req, res);

        const expected = {
            book: 2,
            movie: 2,
            game: 2,
        };

        expect(res.json).toHaveBeenCalledWith({
            acknowledged: true,
            count_by_type: expected,
        });
    });
    it("powinno zwrócić liczbę dzieł według typu (z query)", async () => {
        const req = {
            query: { type: "book,movie,game" },
            params: { reportType: "count_by_type" },
            auth: {
                _id: userId,
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as any;

        res.json.mockImplementation((data: any) => {
            return { ...data };
        });

        await handleReport(req, res);

        const expected = {
            book: 2,
            movie: 2,
            game: 2,
        };

        expect(res.json).toHaveBeenCalledWith({
            acknowledged: true,
            count_by_type: expected,
        });
    });
});

describe("getFinishedCount", () => {
    it("powinno zwrócić liczbę ukończonych dzieł (bez query)", async () => {
        const req = {
            query: {},
            params: { reportType: "finished_count" },
            auth: {
                _id: userId,
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as any;

        res.json.mockImplementation((data: any) => {
            return { ...data };
        });

        await handleReport(req, res);

        const expected = 5;

        expect(res.json).toHaveBeenCalledWith({
            acknowledged: true,
            finished_count: expected,
        });
    });
    it("powinno zwrócić liczbę ukończonych dzieł (z query)", async () => {
        const req = {
            query: { type: "book" },
            params: { reportType: "finished_count" },
            auth: {
                _id: userId,
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as any;

        res.json.mockImplementation((data: any) => {
            return { ...data };
        });

        await handleReport(req, res);

        const expected = 2;

        expect(res.json).toHaveBeenCalledWith({
            acknowledged: true,
            finished_count: expected,
        });
    });
});

describe("getCompletionsByDate", () => {
    it("powinno zwrócić listę ukończeń dzieł według daty (bez query)", async () => {
        const req = {
            query: {},
            params: { reportType: "completions_by_date" },
            auth: {
                _id: userId,
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as any;

        res.json.mockImplementation((data: any) => {
            return { ...data };
        });

        await handleReport(req, res);

        const expected = [
            {
                day: "2021-01-01",
                total: 2,
            },
            {
                day: "2021-01-02",
                total: 3,
            },
            {
                day: "2021-01-03",
                total: 2,
            },
        ];

        expect(res.json).toHaveBeenCalledWith({
            acknowledged: true,
            completions_by_date: expected,
        });
    });
    it("powinno zwrócić listę ukończeń dzieł według daty (z query)", async () => {
        const req = {
            query: { type: "book" },
            params: { reportType: "completions_by_date" },
            auth: {
                _id: userId,
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as any;

        res.json.mockImplementation((data: any) => {
            return { ...data };
        });

        await handleReport(req, res);

        const expected = [
            {
                day: "2021-01-01",
                total: 1,
            },
            {
                day: "2021-01-02",
                total: 1,
            },
            {
                day: "2021-01-03",
                total: 1,
            },
        ];

        expect(res.json).toHaveBeenCalledWith({
            acknowledged: true,
            completions_by_date: expected,
        });
    });
});
