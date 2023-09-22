import Image from "../models/image.js";
import { Request, Response, NextFunction } from "express";
import { inspect } from "util";
import Debug from "debug";
import { ExtendedValidator } from "../scripts/customValidator.js";
const debug = Debug("project:dev");

const { param, body, validationResult } = ExtendedValidator();

export async function getCount(req: Request, res: Response) {
    const count = await Image.count();
    res.json({ count });
}

export async function getAll(req: Request, res: Response) {
    const images = await Image.find({}, { __v: 0 });
    res.json(images);
}

export const getOne = [
    param("id").isMongoId().withMessage("URL contains incorrect id"),
    async function (req: Request, res: Response, next: NextFunction) {
        try {
            validationResult(req).throw();
            const images = await Image.findById(req.params.id).exec();
            res.json({ data: images });
        } catch (e: any) {
            return next(e);
        }
    },
];

export const createOne = [
    body("image")
        .exists()
        .withMessage("Missing image string")
        .trim(),
    async function (req: Request | any, res: Response) {
        const valResult = validationResult(req); //debug(inspect(req.body, false, null, true));

        if (!valResult.isEmpty())
            return res
                .status(422)
                .json({ acknowledged: false, errors: valResult.array() });

        const image = await Image.create({
            ...req.body,
        });
        await image.save();

        return res.json({ acknowledged: true, created: image });
    },
];

export const updateOne = [
    param("id").isMongoId().withMessage("URL contains incorrect id"),
    body("image")
        .exists()
        .withMessage("Missing image string")
        .trim(),
    async function (req: Request, res: Response, next: NextFunction) {
        try {
            if (req.body.nick === undefined) {
                req.body.nick = null;
            }
            console.log(req.body);
            validationResult(req).throw();

            const image = await Image.findByIdAndUpdate(req.params.id, req.body, {});

            return res.json({ acknowledged: true, updated: image });
        } catch (error) {
            return next(error);
        }
    },
];

export const deleteOne = [
    param("id").isMongoId().withMessage("URL contains incorrect id"),
    async function (req: Request, res: Response, next: NextFunction) {
        try {
            validationResult(req).throw();

            const instance = await Image.findById(req.params.id);

            if (!instance) {
                return res.status(404).json({ error: "This image does not exist." });
            }

            const result = await Image.findByIdAndRemove(req.params.id);
            return res.json({ acknowledged: true, deleted: result });
        } catch (error) {
            return next(error);
        }
    },
];

export const showOne = [
    async function (req: Request, res: Response, next: NextFunction) {
        try {
            const images = await Image.findById(req.params.id).exec();

            if (!images) {
                return res.status(404).send('Image does not exist');
            }

            res.set('Content-Type', 'image/jpg');

            if (images.image) {
                const buffer = Buffer.from(images.image, 'base64');
                res.send(buffer);
            } else {
                return res.status(404).send('Base64 image does not exist');
            }
        } catch (e: any) {
            //console.log(res);
            return next(e);
        }
    },
];
