import Movie from "../models/movie.js";
import { Request, Response } from "express";

export async function getAllMovies(req: Request, res: Response) {
    const movies = await Movie.find({});
    res.json(movies);
}

export async function getAllWithPeople(req: Request, res: Response) {
    const movies = await Movie.find({}).populate("people.person_id").exec();
    res.json(movies);
}
