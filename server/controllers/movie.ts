import Movie from "../models/movie.js";
import { Request, Response } from "express";

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

export async function createOne(req: Request, res: Response) {}
