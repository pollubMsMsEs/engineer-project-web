import Movie from "../models/movie.js";
import { Request, Response, NextFunction } from "express";
import { inspect } from "util";
import Debug from "debug";
import { ExtendedValidator } from "../scripts/customValidator.js";
const debug = Debug("dev");

const { param, body, validationResult } = ExtendedValidator();

export async function getCount(req: Request, res: Response) {
    const count = await Movie.count();
    res.json({ count });
}

export async function getAllShort(req: Request, res: Response) {
    const movies = await Movie.find({}, { title: 1 });
    res.json(movies);
}

export async function getAllPopulated(req: Request, res: Response) {
    const movies = await Movie.find({}).populate("people.person_id").exec();
    res.json(movies);
}

export const getOne = [
    param("id").isMongoId().withMessage("URL contains incorrect id"),
    async function (req: Request, res: Response, next: NextFunction) {
        try {
            validationResult(req).throw();
            const movie = await Movie.findById(req.params.id)
                .populate("people.person_id")
                .exec();
            res.json({ data: movie });
        } catch (e: any) {
            //console.log(res);
            return next(e);
        }
    },
];

export const createOne = [
    bodyGenreIntoArray,
    body("created_by").optional().trim().isMongoId().escape(), //DEVTEMP: optional
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
        const valResult = validationResult(req); //debug(inspect(req.body, false, null, true));

        if (!valResult.isEmpty())
            return res
                .status(422)
                .json({ acknowledged: false, errors: valResult.array() });

        const movie = await Movie.create(req.body);
        await movie.save();

        return res.json({ acknowledged: true });
    },
];

export const updateOne = [
    bodyGenreIntoArray,
    param("id").isMongoId().withMessage("URL contains incorrect id"),
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
    async function (req: Request, res: Response, next: NextFunction) {
        try {
            validationResult(req).throw();

            await Movie.findByIdAndUpdate(req.params.id, req.body, {});
            return res.json({ acknowledged: true });
        } catch (error) {
            next(error);
        }
    },
];

export const deleteOne = [
    param("id").isMongoId().withMessage("URL contains incorrect id"),
    async function (req: Request, res: Response, next: NextFunction) {
        try {
            validationResult(req).throw();
            const result = await Movie.findByIdAndRemove(req.params.id);
            return res.json({ acknowledged: true, deleted: result });
        } catch (error) {
            return next(error);
        }
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
