import Person from "../models/person.js";
import Movie from "../models/movie.js";
import { Request, Response, NextFunction } from "express";
import Debug from "debug";
import { ExtendedValidator } from "../scripts/customValidator.js";
const debug = Debug("dev");

const { param, body, validationResult } = ExtendedValidator({
    isReferenced: async (value: any) => {
        const found = await Movie.findOne({ "people.person_id": value }).exec();
        if (found != null) {
            throw new Error(
                "Remove all references to this person before deleting"
            );
        }
    },
});

export async function getCount(req: Request, res: Response) {
    const count = await Person.count();
    res.json({ count });
}

export async function getAll(req: Request, res: Response) {
    const people = await Person.find({}, { __v: 0 });
    res.json(people);
}

export const getOne = [
    param("id").isMongoId().withMessage("URL contains incorrect id"),
    async function (req: Request, res: Response, next: NextFunction) {
        try {
            validationResult(req).throw();
            const person = await Person.findById(req.params.id).exec();
            res.json({ data: person });
        } catch (e: any) {
            return next(e);
        }
    },
];

export const createOne = [
    body("name").trim().isLength({ min: 1 }).escape(),
    body("nick").optional().trim().isLength({ min: 1 }).escape(),
    body("surname").trim().isLength({ min: 1 }).escape(),
    async function (req: Request, res: Response, next: NextFunction) {
        try {
            validationResult(req).throw();

            const person = await Person.create(req.body);
            await person.save();

            return res.json({ acknowledged: true });
        } catch (error) {
            return next(error);
        }
    },
];

export const updateOne = [
    param("id").isMongoId().withMessage("URL contains incorrect id"),
    body("name").trim().isLength({ min: 1 }).escape(),
    body("nick").optional().trim().isLength({ min: 1 }).escape(),
    body("surname").trim().isLength({ min: 1 }).escape(),
    async function (req: Request, res: Response, next: NextFunction) {
        try {
            validationResult(req).throw();

            await Person.findByIdAndUpdate(req.params.id, req.body, {});

            return res.json({ acknowledged: true });
        } catch (error) {
            return next(error);
        }
    },
];

export const deleteOne = [
    param("id")
        .isMongoId()
        .withMessage("URL contains incorrect id")
        .bail()
        .isReferenced(),
    async function (req: Request, res: Response, next: NextFunction) {
        try {
            validationResult(req).throw();
            const result = await Person.findByIdAndRemove(req.params.id);
            return res.json({ acknowledged: true, deleted: result });
        } catch (error) {
            return next(error);
        }
    },
];
