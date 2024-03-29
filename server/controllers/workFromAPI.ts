import WorkFromAPI from "../models/workFromAPI.js";
import WorkInstance from "../models/workInstance.js";
import { Request, Response, NextFunction } from "express";
import { ExtendedValidator } from "../scripts/customValidator.js";

const { param, body, validationResult } = ExtendedValidator();

export async function getAll(req: Request, res: Response) {
    try {
        const worksFromAPI = await WorkFromAPI.find({});
        res.json(worksFromAPI);
    } catch (error) {
        return res.status(500).json({
            acknowledged: false,
            errors: "Internal Server Error",
        });
    }
}

export const getAllByType = [
    param("type").isString().withMessage("Type must be a string"),
    async function (req: Request, res: Response, next: NextFunction) {
        try {
            validationResult(req).throw();
            const worksFromAPI = await WorkFromAPI.find({
                type: req.params.type,
            }).exec();
            res.json({ data: worksFromAPI });
        } catch (e: any) {
            return next(e);
        }
    },
];

export const getOne = [
    param("id").isMongoId().withMessage("URL contains incorrect id"),
    async function (req: Request, res: Response, next: NextFunction) {
        try {
            validationResult(req).throw();

            const worksFromAPI = await WorkFromAPI.findById(
                req.params.id
            ).exec();

            if (!worksFromAPI) {
                return res
                    .status(404)
                    .json({ error: "This work does not exist." });
            }

            res.json({ data: worksFromAPI });
        } catch (e: any) {
            return next(e);
        }
    },
];

export const createOne = [
    body("api_id")
        .exists()
        .withMessage("Missing api_id string")
        .trim()
        .escape(),
    body("title").isString().trim(),
    body("cover")
        .optional()
        .isString()
        .trim()
        .isURL({
            protocols: ["http", "https"],
            require_tld: false,
            require_protocol: true,
        })
        .withMessage("Invalid URL format for cover"),
    body("type")
        .exists()
        .withMessage("Missing type string")
        .trim()
        .escape()
        .custom((value) => {
            return ["movie", "book", "game"].includes(value);
        })
        .withMessage("Type must be one of 'movie', 'book' or 'game'"),
    async function (req: Request | any, res: Response) {
        try {
            const valResult = validationResult(req);

            if (!valResult.isEmpty())
                return res
                    .status(422)
                    .json({ acknowledged: false, errors: valResult.array() });

            const workFromAPI = await WorkFromAPI.create({
                ...req.body,
            });
            await workFromAPI.save();

            return res.json({ acknowledged: true, created: workFromAPI });
        } catch (error) {
            return res.status(500).json({
                acknowledged: false,
                errors: "Internal Server Error",
            });
        }
    },
];

export const updateOne = [
    param("id").isMongoId().withMessage("URL contains incorrect id"),
    body("api_id")
        .exists()
        .withMessage("Missing api_id string")
        .trim()
        .escape(),
    body("title").isString().trim(),
    body("cover")
        .optional()
        .isString()
        .trim()
        .isURL({
            protocols: ["http", "https"],
            require_tld: false,
            require_protocol: true,
        })
        .withMessage("Invalid URL format for cover"),
    body("type")
        .exists()
        .withMessage("Missing type string")
        .trim()
        .escape()
        .custom((value) => {
            return ["movie", "book", "game"].includes(value);
        })
        .withMessage("Type must be one of 'movie', 'book' or 'game'"),
    async function (req: Request | any, res: Response, next: NextFunction) {
        try {
            validationResult(req).throw();

            const workFromAPI = await WorkFromAPI.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );

            return res.json({ acknowledged: true, updated: workFromAPI });
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

            const instance = await WorkFromAPI.findById(req.params.id);

            if (!instance) {
                return res
                    .status(404)
                    .json({ error: "This work does not exist." });
            }

            const workInstanceResult = await WorkInstance.deleteMany({
                work_id: req.params.id,
            });

            const workFromAPIResult = await WorkFromAPI.findByIdAndRemove(
                req.params.id
            );
            return res.json({
                acknowledged: true,
                deleted: {
                    workInstancesCount: workInstanceResult.deletedCount,
                    work: workFromAPIResult,
                },
            });
        } catch (error) {
            return next(error);
        }
    },
];
