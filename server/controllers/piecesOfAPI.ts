import PiecesOfAPI from "../models/piecesOfAPI.js";
import { Request, Response, NextFunction } from "express";
import { inspect } from "util";
import Debug from "debug";
import { ExtendedValidator } from "../scripts/customValidator.js";
const debug = Debug("project:dev");

const { param, body, validationResult } = ExtendedValidator();

export async function getAll(req: Request, res: Response) {
    const piecesOfAPI = await PiecesOfAPI.find({});
    res.json(piecesOfAPI);
}

export const getAllByType = [
    param("type").isString().withMessage("Type must be a string"),
    async function (req: Request, res: Response, next: NextFunction) {
        try {
            validationResult(req).throw();
            const piecesOfAPI = await PiecesOfAPI.find({ type: req.params.type }).exec();
            res.json({ data: piecesOfAPI });
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
            const piecesOfAPI = await PiecesOfAPI.findById(req.params.id)
                .exec();
            res.json({ data: piecesOfAPI });
        } catch (e: any) {
            //console.log(res);
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

        const piecesOfAPI = await PiecesOfAPI.create({
            ...req.body,
        });
        await piecesOfAPI.save();

        return res.json({ acknowledged: true });
    },
];

export const updateOne = [
    param("id")
        .isMongoId()
        .withMessage("URL contains incorrect id"),
    body("api_id")
        .exists()
        .withMessage("Missing api_id string")
        .trim()
        .escape(),
    body("type")
        .exists()
        .withMessage("Missing type string")
        .trim()
        .escape()
        .custom((value) => {
            return ['movie', 'book', 'computerGame'].includes(value);
        }).withMessage("Type must be one of 'movie', 'book' or 'computerGame'"),
    async function (req: Request | any, res: Response, next: NextFunction) {
        try {
            validationResult(req).throw();

            await PiecesOfAPI.findByIdAndUpdate(req.params.id, req.body, {});
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

            const result = await PiecesOfAPI.findByIdAndRemove(req.params.id);
            return res.json({ acknowledged: true, deleted: result });
        } catch (error) {
            return next(error);
        }
    },
];
