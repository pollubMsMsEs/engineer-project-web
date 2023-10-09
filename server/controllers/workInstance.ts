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
                    },
                })
                .exec();
            res.json({ data: workInstances });
        } catch (e: any) {
            //console.log(res);
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
                    },
                })
                .exec();
            res.json({ data: workInstances });
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

            const workInstance = await WorkInstance.findById(req.params.id)
                .populate({
                    path: "work_id",
                    populate: {
                        path: "people.person_id",
                        model: "Person",
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
            //console.log(res);
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
    body("viewings").isArray().withMessage("Viewings must be an array"),
    body("viewings.*")
        .optional()
        .isISO8601()
        .withMessage("Incorrect format in viewings array")
        .bail()
        .custom((value) => {
            console.log("Validating date:", value);
            const viewingDate = new Date(value);
            const currentDate = new Date();

            return viewingDate <= currentDate;
        })
        .withMessage("Viewing date cannot be in the future")
        .bail()
        .toDate(),
    body("number_of_viewings")
        .custom((value, { req }) => {
            if (req.body.viewings && Array.isArray(req.body.viewings)) {
                return req.body.viewings.length <= parseInt(value);
            }
            return false;
        })
        .withMessage(
            "Number_of_viewings must match or be greater than the length of the viewings array"
        ),
    body("status").optional().trim().escape(),
    body("from_api")
        .exists()
        .withMessage("Missing from_api boolean")
        .bail()
        .isBoolean()
        .withMessage("From_api must be a boolean"),
    async function (req: Request | any, res: Response) {
        const valResult = validationResult(req); //debug(inspect(req.body, false, null, true));

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
    body("viewings").isArray().withMessage("Viewings must be an array"),
    body("viewings.*")
        .optional()
        .isISO8601()
        .withMessage("Incorrect format in viewings array")
        .bail()
        .custom((value) => {
            console.log("Validating date:", value);
            const viewingDate = new Date(value);
            const currentDate = new Date();

            return viewingDate <= currentDate;
        })
        .withMessage("Viewing date cannot be in the future")
        .bail()
        .toDate(),
    body("number_of_viewings")
        .custom((value, { req }) => {
            if (req.body.viewings && Array.isArray(req.body.viewings)) {
                return req.body.viewings.length <= parseInt(value);
            }
            return false;
        })
        .withMessage(
            "Number_of_viewings must match or be greater than the length of the viewings array"
        ),
    body("status").optional().trim().escape(),
    body("from_api")
        .exists()
        .withMessage("Missing from_api boolean")
        .bail()
        .isBoolean()
        .withMessage("From_api must be a boolean"),
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
                    },
                })
                .exec();

            return res.json({ acknowledged: true, deleted: result });
        } catch (error) {
            return next(error);
        }
    },
];
