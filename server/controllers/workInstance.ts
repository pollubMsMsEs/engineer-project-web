import WorkInstance from "../models/workInstance.js";
import { getBookAuthorFromAPI, getOneFromAPI } from "./searchAPI.js";
import { Request, Response, NextFunction } from "express";
import { inspect } from "util";
import Debug from "debug";
import { ExtendedValidator } from "../scripts/customValidator.js";
import mongoose from "mongoose";
import {
    format,
    isPast,
    parseISO,
    isAfter,
    isEqual,
    fromUnixTime,
    parse,
} from "date-fns";
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

            if (workInstance.onModel === "WorkFromAPI") {
                const transformedData = await transformToWorkType(
                    workInstance.work_id
                );
                const responseData = {
                    ...workInstance.toObject(),
                    work_id: transformedData,
                };
                res.json({ data: responseData });
            } else {
                res.json({ data: workInstance });
            }
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
            const completionDate = parseISO(value);
            return isPast(completionDate);
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
    body("began_at")
        .optional()
        .isISO8601()
        .withMessage("Incorrect format for began_at date")
        .bail()
        .custom((value) => {
            const beganDate = parseISO(value);
            return isPast(beganDate);
        })
        .withMessage("Began_at date cannot be in the future")
        .bail()
        .toDate(),

    body("finished_at")
        .optional()
        .isISO8601()
        .withMessage("Incorrect format for finished_at date")
        .bail()
        .custom((value) => {
            const finishedDate = parseISO(value);
            return isPast(finishedDate);
        })
        .withMessage("Finished_at date cannot be in the future")
        .bail()
        .toDate(),
    body("metadata[*].*").optional().escape(),
    body()
        .custom((body) => {
            if (body.began_at && body.finished_at) {
                const beganDate = new Date(body.began_at);
                const finishedDate = new Date(body.finished_at);
                if (
                    isAfter(beganDate, finishedDate) ||
                    isEqual(beganDate, finishedDate)
                ) {
                    return false;
                }
            }
            return true;
        })
        .withMessage(
            "Began_at date cannot be at the same time or after finished_at date"
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
            const completionDate = parseISO(value);
            return isPast(completionDate);
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
    body("began_at")
        .optional()
        .isISO8601()
        .withMessage("Incorrect format for began_at date")
        .bail()
        .custom((value) => {
            const beganDate = parseISO(value);
            return isPast(beganDate);
        })
        .withMessage("Began_at date cannot be in the future")
        .bail()
        .toDate(),

    body("finished_at")
        .optional()
        .isISO8601()
        .withMessage("Incorrect format for finished_at date")
        .bail()
        .custom((value) => {
            const finishedDate = parseISO(value);
            return isPast(finishedDate);
        })
        .withMessage("Finished_at date cannot be in the future")
        .bail()
        .toDate(),
    body("metadata[*].*").optional().escape(),
    body()
        .custom((body) => {
            if (body.began_at && body.finished_at) {
                const beganDate = new Date(body.began_at);
                const finishedDate = new Date(body.finished_at);
                if (
                    isAfter(beganDate, finishedDate) ||
                    isEqual(beganDate, finishedDate)
                ) {
                    return false;
                }
            }
            return true;
        })
        .withMessage(
            "Began_at date cannot be at the same time or after finished_at date"
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

            req.body.from_api = instance.onModel === "WorkFromAPI";
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

async function transformToWorkType(work: any) {
    let transformedData;
    let transformedPeople;
    const apiId = work.api_id;
    const type = work.type;
    const workDataFromAPI = await getOneFromAPI(apiId, type);

    switch (type) {
        case "book":
            transformedPeople =
                (await transformPeople(workDataFromAPI.authors, type)) ?? [];

            transformedData = {
                _id: apiId,
                title: work.title ? work.title : workDataFromAPI.title ?? "",
                description:
                    workDataFromAPI.description?.value ??
                    workDataFromAPI.description ??
                    "",
                published_at: workDataFromAPI.first_publish_date
                    ? convertDate(workDataFromAPI.first_publish_date)
                    : "",
                cover: work.cover
                    ? work.cover
                    : Array.isArray(workDataFromAPI.covers)
                    ? `http://covers.openlibrary.org/b/id/${workDataFromAPI.covers[0]}.jpg`
                    : "",
                genres: [],
                people: transformedPeople,
                metadata: {
                    places: Array.isArray(workDataFromAPI.subject_places)
                        ? workDataFromAPI.subject_places
                        : [],
                    characters: Array.isArray(workDataFromAPI.subject_people)
                        ? workDataFromAPI.subject_people
                        : [],
                },
                type: type,
                __v: 0,
            };

            break;
        case "movie":
            const cast = workDataFromAPI.credits?.cast ?? [];
            const crew = workDataFromAPI.credits?.crew ?? [];
            const peopleToTransform = cast.concat(crew);
            transformedPeople =
                (await transformPeople(peopleToTransform, type)) ?? [];

            transformedData = {
                _id: apiId,
                title: work.title ? work.title : workDataFromAPI.title ?? "",
                description: workDataFromAPI.overview ?? "",
                published_at: workDataFromAPI.release_date ?? "",
                cover: work.cover
                    ? work.cover
                    : workDataFromAPI.poster_path
                    ? `https://image.tmdb.org/t/p/w500${workDataFromAPI.poster_path}`
                    : "",
                genres:
                    workDataFromAPI.genres?.map(
                        (genre: { name: String }) => genre.name
                    ) ?? [],
                people: transformedPeople,
                metadata: {
                    production_companies: Array.isArray(
                        workDataFromAPI.production_companies
                    )
                        ? workDataFromAPI.production_companies.map(
                              (company: { name: String }) => company.name
                          )
                        : [],
                },
                type: type,
                __v: 0,
            };

            break;
        case "game":
            transformedData = {
                _id: apiId,
                title: work.title ? work.title : workDataFromAPI.title ?? "",
                description: workDataFromAPI.summary ?? "",
                published_at: workDataFromAPI.first_release_date
                    ? format(
                          fromUnixTime(workDataFromAPI.first_release_date),
                          "yyyy-MM-dd"
                      )
                    : "",
                cover: work.cover
                    ? work.cover
                    : workDataFromAPI.cover
                    ? `https:${workDataFromAPI.cover.url.replace(
                          "t_thumb",
                          "t_cover_big"
                      )}`
                    : "",
                genres:
                    workDataFromAPI.genres?.map(
                        (genre: { name: String }) => genre.name
                    ) ?? [],
                people: [],
                metadata: {
                    developers: Array.isArray(
                        workDataFromAPI.involved_companies
                    )
                        ? workDataFromAPI.involved_companies
                              .filter(
                                  (company: { developer: boolean }) =>
                                      company.developer
                              )
                              .map(
                                  (company: { company: { name: String } }) =>
                                      company.company.name
                              )
                        : [],
                    publishers: Array.isArray(
                        workDataFromAPI.involved_companies
                    )
                        ? workDataFromAPI.involved_companies
                              .filter(
                                  (company: { publisher: boolean }) =>
                                      company.publisher
                              )
                              .map(
                                  (company: { company: { name: String } }) =>
                                      company.company.name
                              )
                        : [],
                },
                type: type,
                __v: 0,
            };

            break;
    }

    return transformedData;
}

async function transformPeople(people: any[], type: String) {
    let results: any[] = [];
    try {
        switch (type) {
            case "book":
                results = await Promise.all(
                    people.map(async (authorData) => {
                        const authorPersonalData = await getBookAuthorFromAPI(
                            authorData.author.key.replace("/authors/", "")
                        );
                        return {
                            person_id: {
                                _id: authorData.author.key.replace(
                                    "/authors/",
                                    ""
                                ),
                                name: authorPersonalData.name ?? "",
                                surname: "",
                            },
                            role:
                                authorData.type.key
                                    .replace("/type/", "")
                                    .replace("_role", "") ?? "",
                            details: {},
                        };
                    })
                );
                break;
            case "movie":
                results = await Promise.all(
                    people.map(async (person) => {
                        return {
                            person_id: {
                                _id: person.id.toString(),
                                name: person.name ?? "",
                                surname: "",
                            },
                            role: person.known_for_department ?? "",
                            details: {
                                character: person.character
                                    ? [person.character]
                                    : [],
                                job: person.job ? [person.job] : [],
                            },
                        };
                    })
                );
                break;
        }
        return results;
    } catch (error) {
        return [];
    }
}

const convertDate = (dateString: string) => {
    try {
        if (/^\d{4}$/.test(dateString)) {
            return `${dateString}-01-01`;
        } else {
            const parsedDate = parse(dateString, "MMMM d, yyyy", new Date());
            return format(parsedDate, "yyyy-MM-dd");
        }
    } catch (error) {
        console.error("Error parsing date:", error);
        return null;
    }
};
