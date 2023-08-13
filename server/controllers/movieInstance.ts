import MovieInstance from "../models/movieInstance.js";
import { Request, Response, NextFunction } from "express";
import { inspect } from "util";
import Debug from "debug";
import { ExtendedValidator } from "../scripts/customValidator.js";
const debug = Debug("project:dev");

const { param, body, validationResult } = ExtendedValidator();

export async function getAll(req: Request, res: Response) {
    const movieInstances = await MovieInstance.find({});
    res.json(movieInstances);
}

export const getAllForUser = [
    param("id").isMongoId().withMessage("URL contains incorrect id"),
    async function (req: Request, res: Response, next: NextFunction) {
        try {
            validationResult(req).throw();
            const movieInstances = await MovieInstance.find({ user_id: req.params.id }).exec();
            res.json({ data: movieInstances });
        } catch (e: any) {
            //console.log(res);
            return next(e);
        }
    },
];

export const getOne = [
    param("id").isMongoId().withMessage("URL contains incorrect id"),
    async function (req: Request, res: Response, next: NextFunction) {
        try {
            validationResult(req).throw();
            const movieInstance = await MovieInstance.findById(req.params.id)
                .exec();
            res.json({ data: movieInstance });
        } catch (e: any) {
            //console.log(res);
            return next(e);
        }
    },
];

export const createOne = [
    body("movie_id").isMongoId(),
    body("rating")
        .optional()
        .custom((value) => {
            if (value === "") return true;
            const intValue = parseInt(value);
            if (isNaN(intValue)) return false;
            return Number.isInteger(intValue) && intValue >= 0 && intValue <= 10 && value === intValue.toString();
        })
        .withMessage("Rating must be an integer number between 0 and 10"),
    body("description").optional().trim().escape(),
    body("viewings")
        .isArray()
        .withMessage("Viewings must be an array"),
    body("viewings.*")
        .optional()
        .isISO8601()
        .withMessage("Incorrect format in viewings array")
        .bail()
        .custom((value) => {
            console.log("Validating date:", value);
            const viewingDate = new Date(value);
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);
            return viewingDate <= currentDate;
        })
        .withMessage("Viewing date cannot be in the future")
        .bail()
        .toDate(),
    body("number_of_viewings")
        .custom((value, { req }) => {
            if (req.body.viewings && Array.isArray(req.body.viewings)) {
                return req.body.viewings.length.toString() === value;
            }
            return false;
        })
        .withMessage("Number_of_viewings must match the length of the viewings array"),
    body("completed")
        .exists()
        .withMessage("Missing completed boolean")
        .isBoolean()
        .withMessage("Completed must be a boolean"),
    async function (req: Request | any, res: Response) {
        const valResult = validationResult(req); //debug(inspect(req.body, false, null, true));

        if (!valResult.isEmpty())
            return res
                .status(422)
                .json({ acknowledged: false, errors: valResult.array() });

        const movieInstance = await MovieInstance.create({
            ...req.body,
            user_id: req.auth._id,
        });
        await movieInstance.save();

        return res.json({ acknowledged: true });
    },
];

export const updateOne = [
    body("movie_id").isMongoId(),
    body("rating")
        .optional()
        .custom((value) => {
            if (value === "") return true;
            const intValue = parseInt(value);
            if (isNaN(intValue)) return false;
            return Number.isInteger(intValue) && intValue >= 0 && intValue <= 10 && value === intValue.toString();
        })
        .withMessage("Rating must be an integer number between 0 and 10"),
    body("description").optional().trim().escape(),
    body("viewings")
        .isArray()
        .withMessage("Viewings must be an array"),
    body("viewings.*")
        .optional()
        .isISO8601()
        .withMessage("Incorrect format in viewings array")
        .bail()
        .custom((value) => {
            console.log("Validating date:", value);
            const viewingDate = new Date(value);
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);
            return viewingDate <= currentDate;
        })
        .withMessage("Viewing date cannot be in the future")
        .bail()
        .toDate(),
    body("number_of_viewings")
        .custom((value, { req }) => {
            if (req.body.viewings && Array.isArray(req.body.viewings)) {
                return req.body.viewings.length.toString() === value;
            }
            return false;
        })
        .withMessage("Number_of_viewings must match the length of the viewings array"),
    body("completed")
        .exists()
        .withMessage("Missing completed boolean")
        .isBoolean()
        .withMessage("Completed must be a boolean"),
    async function (req: Request | any, res: Response, next: NextFunction) {
        try {
            validationResult(req).throw();

            const instance = await MovieInstance.findById(req.params.id);

            if (!instance || String(instance.user_id) !== req.auth._id) {
                return res.status(403).json({ error: "You do not have permission to update this movie instance." });
            }

            await MovieInstance.findByIdAndUpdate(req.params.id, req.body, {});
            return res.json({ acknowledged: true });
        } catch (error) {
            next(error);
        }
    },
];

export const deleteOne = [
    param("id").isMongoId().withMessage("URL contains incorrect id"),
    async function (req: Request | any, res: Response, next: NextFunction) {
        try {
            validationResult(req).throw();

            const instance = await MovieInstance.findById(req.params.id);

            if (!instance || String(instance.user_id) !== req.auth._id) {
                return res.status(403).json({ error: "You do not have permission to delete this movie instance." });
            }

            const result = await MovieInstance.findByIdAndRemove(req.params.id);
            return res.json({ acknowledged: true, deleted: result });
        } catch (error) {
            return next(error);
        }
    },
];