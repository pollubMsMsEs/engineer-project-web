import WorkInstance from "../models/workInstance.js";
import { Request, Response, NextFunction } from "express";
import { inspect } from "util";
import Debug from "debug";
import axios from "axios";
const debug = Debug("project:dev");

export async function search(req: Request | any, res: Response): Promise<void> {
    try {
        const type = req.params.type as string;
        const query = req.query.query as string;
        const userId = req.auth._id;

        let results: any[] = [];

        switch (type) {
            case "book":
                results = await searchBooks(query);
                break;
            case "movie":
                results = await searchMovies(query);
                break;
            case "game":
                results = await searchGames(query);
                break;
            default:
                res.status(400).json({
                    acknowledged: false,
                    errors: "Type must be one of 'movie', 'book' or 'game'",
                });
                return;
        }

        const workInstances = await Promise.all(
            results.map((work) =>
                findWorkInstanceByUserIdAndApiId(userId, work.api_key)
            )
        );

        for (let i = 0; i < results.length; i++) {
            results[i].has_instance = !!workInstances[i];
        }

        res.json(results);
    } catch (error) {
        res.status(500).json({
            acknowledged: false,
            errors: "Internal server error.",
        });
    }
}

async function searchBooks(query: string): Promise<any[]> {
    try {
        const encodedQuery = encodeURIComponent(query);

        const response = await axios.get(
            `https://openlibrary.org/search.json?title=${encodedQuery}`
        );

        const books = response.data.docs.map(
            (book: { title: any; cover_i: any; key: any }) => ({
                title: book.title,
                cover: `http://covers.openlibrary.org/b/id/${book.cover_i}.jpg`,
                has_instance: false,
                api_key: book.key.replace("/works/", ""),
                type: "book",
            })
        );

        return books;
    } catch (error) {
        return [];
    }
}

async function searchMovies(query: string): Promise<any[]> {
    try {
        const TMDB_API_KEY = process.env.TMDB_API_KEY;

        const encodedQuery = encodeURIComponent(query);

        const response = await axios.get(
            `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodedQuery}`
        );

        const movies = response.data.results.map(
            (movie: { title: string; poster_path: string; id: number }) => ({
                title: movie.title,
                cover: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                has_instance: false,
                api_key: movie.id.toString(),
                type: "movie",
            })
        );

        return movies;
    } catch (error) {
        return [];
    }
}

async function searchGames(query: string): Promise<any[]> {
    try {
        const IGDB_CLIENT_ID = process.env.IGDB_CLIENT_ID;

        const accessToken = await getTwitchAccessToken();
        if (!accessToken) {
            console.error("Could not obtain access token.");
            return [];
        }

        const response = await axios({
            url: "https://api.igdb.com/v4/games",
            method: "POST",
            headers: {
                "Client-ID": IGDB_CLIENT_ID,
                Authorization: `Bearer ${accessToken}`,
                Accept: "application/json",
            },
            data: `
                search "${query}";
                fields id, name, cover.url;
                limit 50; 
            `,
        });

        const games = response.data.map(
            (game: { name: string; cover: { url: string }; id: number }) => ({
                title: game.name,
                cover: game.cover
                    ? `https:${game.cover.url.replace(
                          "t_thumb",
                          "t_cover_big"
                      )}`
                    : null,
                has_instance: false,
                api_key: game.id.toString(),
                type: "game",
            })
        );

        return games;
    } catch (error) {
        return [];
    }
}

async function getTwitchAccessToken() {
    try {
        const IGDB_CLIENT_ID = process.env.IGDB_CLIENT_ID;
        const IGDB_CLIENT_SECRET = process.env.IGDB_CLIENT_SECRET;

        const response = await axios.post(
            `https://id.twitch.tv/oauth2/token?client_id=${IGDB_CLIENT_ID}&client_secret=${IGDB_CLIENT_SECRET}&grant_type=client_credentials`
        );
        return response.data.access_token;
    } catch (error) {
        console.error("Error getting Twitch OAuth Token:", error);
        return null;
    }
}

async function findWorkInstanceByUserIdAndApiId(
    user_id: string,
    api_key: string
): Promise<any | null> {
    try {
        const workInstances = await WorkInstance.find({
            user_id: user_id,
            from_api: true,
        })
            .populate("work_id")
            .exec();

        for (let instance of workInstances) {
            const workIdData: any = instance.work_id;
            if (instance.work_id && workIdData.api_id === api_key) {
                return instance;
            }
        }

        return null;
    } catch (error) {
        return null;
    }
}
