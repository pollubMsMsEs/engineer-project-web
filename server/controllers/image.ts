import Image from "../models/image.js";
import { Request, Response, NextFunction } from "express";
import { ExtendedValidator } from "../scripts/customValidator.js";
import multer from "multer";

const { param, validationResult } = ExtendedValidator();

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 3 * 1024 * 1024, // 3MB
    },
});

export async function getCount(req: Request, res: Response) {
    try {
        const count = await Image.count();
        res.json({ count });
    } catch (error) {
        return res.status(500).json({
            acknowledged: false,
            errors: "Internal Server Error",
        });
    }
}

export async function getAll(req: Request, res: Response) {
    try {
        const images = await Image.find({}, "_id", { __v: 0 });

        const host = req.get("host");
        const protocol = req.protocol;
        const baseUrl = `${protocol}://${host}/api/image/`;

        const urls = images.map((image) => baseUrl + image._id);

        res.json(urls);
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

            const images = await Image.findById(req.params.id).exec();

            if (!images) {
                return res
                    .status(404)
                    .json({ error: "This image does not exist." });
            }

            res.json({ data: images });
        } catch (e: any) {
            return next(e);
        }
    },
];

export const createOne = [
    upload.single("image"),
    async function (req: Request | any, res: Response) {
        try {
            if (!req.file)
                return res
                    .status(400)
                    .json({ acknowledged: false, message: "No file uploaded" });

            const mimetype = req.file.mimetype;

            if (
                !mimetype.startsWith("image/") &&
                mimetype !== "application/xml"
            ) {
                return res.status(400).json({
                    acknowledged: false,
                    message: "Uploaded file is not an image",
                });
            }

            if (
                mimetype === "application/xml" ||
                mimetype === "image/svg+xml"
            ) {
                const svgString = req.file.buffer.toString("utf-8");
                if (
                    !svgString.includes("<svg") ||
                    !svgString.includes("</svg>")
                ) {
                    return res.status(400).json({
                        acknowledged: false,
                        message: "Uploaded XML file is not a valid SVG image",
                    });
                }
            }

            const base64Image = req.file.buffer.toString("base64");

            const image = await Image.create({
                image: base64Image,
                type: mimetype,
            });
            await image.save();

            const host = req.get("host");
            const protocol = req.protocol;
            return res.json({
                acknowledged: true,
                created: `${protocol}://${host}/api/image/${image._id}`,
            });
        } catch (error) {
            return res.status(500).json({
                acknowledged: false,
                errors: "Internal Server Error",
            });
        }
    },
    function (error: any, req: Request, res: Response, next: NextFunction) {
        // middleware do obsługi błędu multera
        if (error instanceof multer.MulterError) {
            return res
                .status(400)
                .json({ acknowledged: false, message: "File too large" });
        }
        next(error);
    },
];

export const updateOne = [
    param("id").isMongoId().withMessage("URL contains incorrect id"),
    upload.single("image"),
    async function (req: Request | any, res: Response, next: NextFunction) {
        try {
            validationResult(req).throw();

            if (!req.file)
                return res
                    .status(400)
                    .json({ acknowledged: false, message: "No file uploaded" });

            const mimetype = req.file.mimetype;

            if (
                !mimetype.startsWith("image/") &&
                mimetype !== "application/xml"
            ) {
                return res.status(400).json({
                    acknowledged: false,
                    message: "Uploaded file is not an image",
                });
            }

            if (
                mimetype === "application/xml" ||
                mimetype === "image/svg+xml"
            ) {
                const svgString = req.file.buffer.toString("utf-8");
                if (
                    !svgString.includes("<svg") ||
                    !svgString.includes("</svg>")
                ) {
                    return res.status(400).json({
                        acknowledged: false,
                        message: "Uploaded XML file is not a valid SVG image",
                    });
                }
            }

            const base64Image = req.file.buffer.toString("base64");

            const updateData = {
                image: base64Image,
                type: mimetype,
            };

            const image = await Image.findByIdAndUpdate(
                req.params.id,
                updateData,
                { new: true }
            );

            if (!image)
                return res.status(404).json({
                    acknowledged: false,
                    message: "Image does not exist",
                });

            const host = req.get("host");
            const protocol = req.protocol;
            return res.json({
                acknowledged: true,
                updated: `${protocol}://${host}/api/image/${image._id}`,
            });
        } catch (error: any) {
            return next(error);
        }
    },
    function (error: any, req: Request, res: Response, next: NextFunction) {
        // middleware do obsługi błędu multera
        if (error instanceof multer.MulterError) {
            return res
                .status(400)
                .json({ acknowledged: false, message: "File too large" });
        }
        next(error);
    },
];

export const deleteOne = [
    param("id").isMongoId().withMessage("URL contains incorrect id"),
    async function (req: Request, res: Response, next: NextFunction) {
        try {
            validationResult(req).throw();

            const instance = await Image.findById(req.params.id);

            if (!instance) {
                return res
                    .status(404)
                    .json({ error: "This image does not exist." });
            }

            const result = await Image.findByIdAndRemove(req.params.id);
            return res.json({ acknowledged: true, deleted: result });
        } catch (error) {
            return next(error);
        }
    },
];

export const showOne = [
    param("id").isMongoId().withMessage("URL contains incorrect id"),
    async function (req: Request, res: Response, next: NextFunction) {
        try {
            validationResult(req).throw();
            const images = await Image.findById(req.params.id).exec();

            if (!images) {
                return res.status(404).send("Image does not exist");
            }

            res.set("Content-Type", images.type);

            if (images.image) {
                const buffer = Buffer.from(images.image, "base64");
                res.send(buffer);
            } else {
                return res.status(404).send("Base64 image does not exist");
            }
        } catch (e: any) {
            return next(e);
        }
    },
];
