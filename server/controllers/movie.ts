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
