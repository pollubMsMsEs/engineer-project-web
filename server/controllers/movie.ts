import Movie from "../models/movie.js";
import { Request, Response, NextFunction } from "express";
import { body } from "express-validator";

export async function getAllShort(req: Request, res: Response) {
    const movies = await Movie.find({}, { title: 1 });
    res.json(movies);
}

export async function getAllPopulated(req: Request, res: Response) {
    const movies = await Movie.find({}).populate("people.person_id").exec();
    res.json(movies);
}

export async function getOne(req: Request, res: Response) {
    const movie = await Movie.findById(req.params.id)
        .populate("people.person_id")
        .exec();
    res.json(movie);
}

export const createOne = [
    bodyGenreIntoArray,
    body("title").trim().isLength({ min: 1 }).escape(),
    async function (req: Request, res: Response) {
        console.log(req.body);
    },
];

function bodyGenreIntoArray(req: Request, res: Response, next: NextFunction) {
    if (!(req.body.genre instanceof Array)) {
        if (typeof req.body.genre === "undefined") {
            req.body.genre = [];
        } else {
            req.body.genre = new Array(req.body.genre);
        }
    }
    next();
}
