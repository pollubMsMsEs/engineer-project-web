import Work from "../models/work.js";
import { Request, Response, NextFunction } from "express";
import { inspect } from "util";
import Debug from "debug";
import { ExtendedValidator } from "../scripts/customValidator.js";
const debug = Debug("project:dev");

const { param, body, validationResult } = ExtendedValidator();

export async function getCount(req: Request, res: Response) {
    const count = await Work.count();
    res.json({ count });
}

export async function getAllShort(req: Request, res: Response) {
    const works = await Work.find({}, { title: 1 });
    res.json(works);
}

export async function getAllPopulated(req: Request, res: Response) {
    const works = await Work.find({}).populate("people.person_id").exec();
    res.json(works);
}

export const getOne = [
    param("id").isMongoId().withMessage("URL contains incorrect id"),
    async function (req: Request, res: Response, next: NextFunction) {
        try {
            validationResult(req).throw();
            const work = await Work.findById(req.params.id)
                .populate("people.person_id")
                .exec();
            res.json({ data: work });
        } catch (e: any) {
            //console.log(res);
            return next(e);
        }
    },
];

export const createOne = [
    bodyGenreIntoArray,
    body("title").trim().isLength({ min: 1 }).escape(),
    body("description").optional().trim().escape(),
    body("published_at")
        .exists()
        .withMessage("Missing published_at date")
        .isISO8601()
        .withMessage("Incorrect format of published_at date")
        .toDate(),
    body("genres.*").escape(),
    body("metadata[*].*").escape(),
    body("people").optional().isArray(),
    body("people[*].person_id").optional().isMongoId(),
    body("people[*].role")
        .trim()
        .optional()
        .isString()
        .isLength({ min: 1 })
        .escape(),
    body("people.*.details.*").optional().escape(),
    body("type")
        .exists()
        .withMessage("Missing type string")
        .trim()
        .escape()
        .custom((value) => {
            return ['movie', 'book', 'computerGame'].includes(value);
        }).withMessage("Type must be one of 'movie', 'book' or 'computerGame'"),
    async function (req: Request | any, res: Response) {
        const valResult = validationResult(req); //debug(inspect(req.body, false, null, true));

        if (!valResult.isEmpty())
            return res
                .status(422)
                .json({ acknowledged: false, errors: valResult.array() });

        const work = await Work.create({
            ...req.body,
            created_by: req.auth._id,
        });
        await work.save();

        return res.json({ acknowledged: true });
    },
];

export const updateOne = [
    bodyGenreIntoArray,
    param("id").isMongoId().withMessage("URL contains incorrect id"),
    body("title").trim().isLength({ min: 1 }).escape(),
    body("description").optional().trim().escape(),
    body("published_at")
        .exists()
        .withMessage("Missing published_at date")
        .isISO8601()
        .withMessage("Incorrect format of published_at date")
        .toDate(),
    body("genres.*").escape(),
    body("metadata[*].*").escape(),
    body("people").optional().isArray(),
    body("people[*].person_id").optional().isMongoId(),
    body("people[*].role")
        .trim()
        .optional()
        .isString()
        .isLength({ min: 1 })
        .escape(),
    body("people.*.details.*").optional().escape(),
    body("type")
        .exists()
        .withMessage("Missing type string")
        .trim()
        .escape()
        .custom((value) => {
            return ['movie', 'book', 'computerGame'].includes(value);
        }).withMessage("Type must be one of 'movie', 'book' or 'computerGame'"),
    async function (req: Request, res: Response, next: NextFunction) {
        try {
            validationResult(req).throw();

            await Work.findByIdAndUpdate(req.params.id, req.body, {});
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
            const result = await Work.findByIdAndRemove(req.params.id);
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
