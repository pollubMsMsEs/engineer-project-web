import Movie from "../models/movie.js";
import { Request, Response, NextFunction } from "express";
import { ExpressValidator } from "express-validator";
import { Types } from "mongoose";
import { inspect } from "util";
import Debug from "debug";
const debug = Debug("dev");

const { body, validationResult } = new ExpressValidator({
    isMongoId: async (value: any) => {
        if (!Types.ObjectId.isValid(value)) {
            throw new Error("This value isn't ObjectID");
        }
    },
});

export async function getAllShort(req: Request, res: Response) {
    const movies = await Movie.find({}, { title: 1 });
    res.json(movies);
}

export async function getAllPopulated(req: Request, res: Response) {
    const movies = await Movie.find({}).populate("people.person_id").exec();
    res.json(movies);
}

export async function getOne(req: Request, res: Response, next: NextFunction) {
    try {
        const movie = await Movie.findById(req.params.id)
            .populate("people.person_id")
            .exec();
        res.json(movie);
    } catch (e) {
        return next(e);
    }
}

export const createOne = [
    bodyGenreIntoArray,
    body("created_by").trim().isMongoId().escape(),
    body("title").trim().isLength({ min: 1 }).escape(),
    body("description").optional().trim().escape(),
    body("published_at")
        .exists()
        .withMessage("Missing published_at date")
        .isISO8601()
        .withMessage("Incorrect format of published_at date")
        .toDate(),
    body("genres.*").escape(),
    body("metadata.*").escape(),
    body("people.person_id").isMongoId(),
    body("people.role").trim().isString().isLength({ min: 1 }).escape(),
    body("people.details.*").escape(),
    async function (req: Request, res: Response) {
        const result = validationResult(req);
        debug(inspect(req.body, false, null, true));
        if (result.isEmpty()) return res.send("ok");
        else return res.json(result.array());
    },
];

function bodyGenreIntoArray(req: Request, res: Response, next: NextFunction) {
    if (!(req.body.genres instanceof Array)) {
        if (typeof req.body.genres === "undefined") {
            req.body.genres = [];
        } else {
            req.body.genres = new Array(req.body.genres);
        }
    }
    next();
}
