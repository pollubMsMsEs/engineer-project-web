import Person from "../models/person.js";
import Work from "../models/work.js";
import { Request, Response, NextFunction } from "express";
import { ExtendedValidator } from "../scripts/customValidator.js";

const { param, body, validationResult } = ExtendedValidator({
    isReferenced: async (value: any) => {
        const found = await Work.findOne({ "people.person_id": value }).exec();
        if (found != null) {
            throw new Error(
                "Remove all references to this person before deleting"
            );
        }
    },
});

export async function getCount(req: Request, res: Response) {
    try {
        const count = await Person.count();
        res.json({ count });
    } catch (error) {
        return res.status(500).json({
            acknowledged: false,
            errors: "Internal Server Error",
        });
    }
}

export async function getAll(req: Request | any, res: Response) {
    try {
        let LIMIT = 20;
        let OFFSET;

        if (req.query.page) {
            if (req.query.page < 1) {
                return res.status(400).json({
                    acknowledged: false,
                    errors: "Invalid page value",
                });
            }
            OFFSET = (req.query.page - 1) * LIMIT;
        } else {
            OFFSET = 0;
        }

        let queryConditions: any = [{ created_by: req.auth._id }];

        if (req.query.query) {
            queryConditions.push({
                $or: [
                    { name: new RegExp(req.query.query, "i") },
                    { nick: new RegExp(req.query.query, "i") },
                    { surname: new RegExp(req.query.query, "i") },
                ],
            });
        }

        const people = await Person.find({
            $and: queryConditions,
        })
            .skip(OFFSET)
            .limit(LIMIT);

        res.json(people);
    } catch (error) {
        return res.status(500).json({
            acknowledged: false,
            errors: "Internal Server Error",
        });
    }
}

export const getOne = [
    param("id").isMongoId().withMessage("URL contains incorrect id"),
    async function (req: Request, res: Response, next: NextFunction) {
        try {
            validationResult(req).throw();

            const person = await Person.findById(req.params.id).exec();

            if (!person) {
                return res
                    .status(404)
                    .json({ error: "This person does not exist." });
            }

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
    async function (req: Request | any, res: Response, next: NextFunction) {
        try {
            validationResult(req).throw();

            const person = await Person.create({
                ...req.body,
                created_by: req.auth._id,
            });
            await person.save();

            return res.json({ acknowledged: true, created: person });
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
    async function (req: Request | any, res: Response, next: NextFunction) {
        try {
            if (req.body.nick === undefined) {
                req.body.nick = null;
            }
            validationResult(req).throw();

            const personBeforeUpdate = await Person.findById(req.params.id);

            if (String(personBeforeUpdate?.created_by) !== req.auth._id) {
                return res.status(403).json({
                    acknowledged: false,
                    errors: "You do not have permission to update this person.",
                });
            }

            const person = await Person.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                }
            );

            return res.json({ acknowledged: true, updated: person });
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
    async function (req: Request | any, res: Response, next: NextFunction) {
        try {
            validationResult(req).throw();

            const personBeforeDelete = await Person.findById(req.params.id);

            if (String(personBeforeDelete?.created_by) !== req.auth._id) {
                return res.status(403).json({
                    acknowledged: false,
                    errors: "You do not have permission to update this person.",
                });
            }

            const result = await Person.findByIdAndRemove(req.params.id);
            return res.json({ acknowledged: true, deleted: result });
        } catch (error) {
            return next(error);
        }
    },
];
