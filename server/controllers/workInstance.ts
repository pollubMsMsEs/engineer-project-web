import WorkInstance from "../models/workInstance.js";
import { Request, Response, NextFunction } from "express";
import { inspect } from "util";
import Debug from "debug";
import { ExtendedValidator } from "../scripts/customValidator.js";
import mongoose from "mongoose";
const debug = Debug("project:dev");

const { param, body, validationResult } = ExtendedValidator();

export async function getAll(req: Request, res: Response) {
    const workInstances = await WorkInstance.find({})
        .populate({
            path: "work_id",
            populate: {
                path: "people.person_id",
                model: "Person",
                strictPopulate: false,
            },
        })
        .exec();
    res.json(workInstances);
}

export const getAllForUser = [
    param("id").isMongoId().withMessage("URL contains incorrect id"),
    async function (req: Request, res: Response, next: NextFunction) {
        try {
            validationResult(req).throw();
            const workInstances = await WorkInstance.find({
                user_id: req.params.id,
            })
                .populate({
                    path: "work_id",
                    populate: {
                        path: "people.person_id",
                        model: "Person",
                        strictPopulate: false,
                    },
                })
                .exec();
            res.json({ data: workInstances });
        } catch (e: any) {
            return next(e);
        }
    },
];

export const getAllForCurrentUser = [
    async function (req: Request | any, res: Response, next: NextFunction) {
        try {
            validationResult(req).throw();
            const workInstances = await WorkInstance.find({
                user_id: req.auth._id,
            })
                .populate({
                    path: "work_id",
                    populate: {
                        path: "people.person_id",
                        model: "Person",
                        strictPopulate: false,
                    },
                })
                .exec();
            res.json({ data: workInstances });
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

            const workInstance = await WorkInstance.findById(req.params.id)
                .populate({
                    path: "work_id",
                    populate: {
                        path: "people.person_id",
                        model: "Person",
                        strictPopulate: false,
                    },
                })
                .exec();

            if (!workInstance) {
                return res
                    .status(404)
                    .json({ error: "This work instance does not exist." });
            }

            res.json({ data: workInstance });
        } catch (e: any) {
            return next(e);
        }
    },
];

export const createOne = [
    body("work_id").isMongoId(),
    body("onModel")
        .exists()
        .withMessage("Missing onModel string")
        .trim()
        .escape()
        .custom((value) => {
            return ["Work", "WorkFromAPI"].includes(value);
        })
        .withMessage("OnModel must be one of 'Work' or 'WorkFromAPI'"),
    body("rating")
        .optional()
        .custom((value) => {
            if (isNaN(value)) return false;
            return Number.isInteger(value) && value >= 0 && value <= 10;
        })
        .withMessage("Rating must be an integer number between 0 and 10"),
    body("description").optional().trim().escape(),
    body("completions").isArray().withMessage("Completions must be an array"),
    body("completions.*")
        .optional()
        .isISO8601()
        .withMessage("Incorrect format in completions array")
        .bail()
        .custom((value) => {
            const completionDate = new Date(value);
            const currentDate = new Date();

            return completionDate <= currentDate;
        })
        .withMessage("Completion date cannot be in the future")
        .bail()
        .toDate(),
    body("number_of_completions")
        .custom((value, { req }) => {
            if (req.body.completions && Array.isArray(req.body.completions)) {
                return req.body.completions.length <= parseInt(value);
            }
            return false;
        })
        .withMessage(
            "Number_of_completions must match or be greater than the length of the completions array"
        ),
    body("status")
        .optional()
        .trim()
        .escape()
        .custom((value) => {
            return ["wishlist", "todo", "doing", "completed"].includes(value);
        })
        .withMessage(
            "Status must be one of 'wishlist', 'todo', 'doing' or 'completed'"
        ),
    async function (req: Request | any, res: Response) {
        const valResult = validationResult(req);

        if (!valResult.isEmpty())
            return res
                .status(422)
                .json({ acknowledged: false, errors: valResult.array() });

        const Model = mongoose.model(req.body.onModel);
        const work = await Model.findById(req.body.work_id);

        if (!work) {
            return res.status(400).json({
                acknowledged: false,
                errors: "Invalid work_id for the given onModel",
            });
        }

        req.body.from_api = req.body.onModel === "WorkFromAPI";
        req.body.type = work.type;

        const existingInstance = await WorkInstance.findOne({
            work_id: req.body.work_id,
            user_id: req.auth._id,
        });

        if (existingInstance) {
            return res.status(400).json({
                acknowledged: false,
                errors: "User already has an instance with this work_id",
            });
        }

        const workInstance = await WorkInstance.create({
            ...req.body,
            user_id: req.auth._id,
        });
        await workInstance.save();

        const workInstancePopulated = await WorkInstance.findById(
            workInstance._id
        )
            .populate({
                path: "work_id",
                populate: {
                    path: "people.person_id",
                    model: "Person",
                    strictPopulate: false,
                },
            })
            .exec();

        return res.json({ acknowledged: true, created: workInstancePopulated });
    },
];

export const updateOne = [
    body("rating")
        .optional()
        .custom((value) => {
            if (isNaN(value)) return false;

            return Number.isInteger(value) && value >= 0 && value <= 10;
        })
        .withMessage("Rating must be an integer number between 0 and 10"),
    body("description").optional().trim().escape(),
    body("completions").isArray().withMessage("Completions must be an array"),
    body("completions.*")
        .optional()
        .isISO8601()
        .withMessage("Incorrect format in completions array")
        .bail()
        .custom((value) => {
            const completionDate = new Date(value);
            const currentDate = new Date();

            return completionDate <= currentDate;
        })
        .withMessage("Completion date cannot be in the future")
        .bail()
        .toDate(),
    body("number_of_completions")
        .custom((value, { req }) => {
            if (req.body.completions && Array.isArray(req.body.completions)) {
                return req.body.completions.length <= parseInt(value);
            }
            return false;
        })
        .withMessage(
            "Number_of_completions must match or be greater than the length of the completions array"
        ),
    body("status")
        .optional()
        .trim()
        .escape()
        .custom((value) => {
            return ["wishlist", "todo", "doing", "completed"].includes(value);
        })
        .withMessage(
            "Status must be one of 'wishlist', 'todo', 'doing' or 'completed'"
        ),
    async function (req: Request | any, res: Response, next: NextFunction) {
        try {
            validationResult(req).throw();

            const instance = await WorkInstance.findById(req.params.id);

            if (!instance) {
                return res.status(404).json({
                    error: "This work instance does not exist.",
                });
            }

            if (String(instance.user_id) !== req.auth._id) {
                return res.status(403).json({
                    error: "You do not have permission to update this piece of work instance.",
                });
            }

            if (!instance.onModel || typeof instance.onModel !== "string") {
                return res.status(400).json({
                    acknowledged: false,
                    errors: "Invalid or missing onModel",
                });
            }

            const Model = mongoose.model(instance.onModel);
            const work = await Model.findById(instance.work_id);

            if (!work) {
                return res.status(400).json({
                    acknowledged: false,
                    errors: "Invalid work_id for the given onModel",
                });
            }

            req.body.from_api = req.body.onModel === "WorkFromAPI";
            req.body.type = work.type;

            const forbiddenUpdates = ["work_id", "onModel"];
            forbiddenUpdates.forEach((field) => {
                if (req.body[field]) {
                    delete req.body[field];
                }
            });

            const workInstance = await WorkInstance.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            )
                .populate({
                    path: "work_id",
                    populate: {
                        path: "people.person_id",
                        model: "Person",
                        strictPopulate: false,
                    },
                })
                .exec();

            return res.json({ acknowledged: true, updated: workInstance });
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

            const instance = await WorkInstance.findById(req.params.id);

            if (!instance) {
                return res
                    .status(404)
                    .json({ error: "This work instance does not exist." });
            }

            if (String(instance.user_id) !== req.auth._id) {
                return res.status(403).json({
                    error: "You do not have permission to delete this work instance.",
                });
            }

            const result = await WorkInstance.findByIdAndRemove(req.params.id)
                .populate({
                    path: "work_id",
                    populate: {
                        path: "people.person_id",
                        model: "Person",
                        strictPopulate: false,
                    },
                })
                .exec();

            return res.json({ acknowledged: true, deleted: result });
        } catch (error) {
            return next(error);
        }
    },
];
