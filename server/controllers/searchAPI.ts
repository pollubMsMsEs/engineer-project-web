import WorkInstance from "../models/workInstance.js";
import { Request, Response, NextFunction } from "express";
import { inspect } from "util";
import Debug from "debug";
import axios from "axios";
import { Mutex } from "async-mutex";
const debug = Debug("project:dev");

const mutex = new Mutex();
let twitchAccessToken: string | null = null;
let twitchTokenExpiry: number | null = null;

export async function getOneFromAPI(apiId: any, type: any) {
    let results;
    switch (type) {
        case "book":
            results = await getBookFromAPI(apiId);
            break;
        case "movie":
            results = await getMovieFromAPI(apiId);
            break;
        case "game":
            results = await getGameFromAPI(apiId);
            break;
    }
    return results;
}

export async function search(req: Request | any, res: Response): Promise<void> {
    try {
        const type = req.params.type as string;
        const query = req.query.query as string;
        const userId = req.auth._id;

        let results: any[] = [];

        switch (type) {
            case "book":
                results = await searchBooks(query, req.query.page);
                break;
            case "movie":
                results = await searchMovies(query, req.query.page);
                break;
            case "game":
                results = await searchGames(query, req.query.page);
                break;
            default:
                res.status(400).json({
                    acknowledged: false,
                    errors: "Type must be one of 'movie', 'book' or 'game'",
                });
                return;
        }

        let workInstances = await WorkInstance.find({
            user_id: userId,
            from_api: true,
        })
            .populate("work_id")
            .exec();

        workInstances = await Promise.all(
            results.map((work) =>
                findWorkInstanceByUserIdAndApiId(work.api_key, workInstances)
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

async function searchBooks(query: string, page: number = 1): Promise<any[]> {
    try {
        const LIMIT = 20;
        const OFFSET = (page - 1) * LIMIT;
        const encodedQuery = encodeURIComponent(query);

        const response = await axios.get(
            `https://openlibrary.org/search.json?title=${encodedQuery}&limit=${LIMIT}&offset=${OFFSET}`
        );

        const books = response.data.docs.map(
            (book: { title: any; cover_i: any; key: any }) => ({
                title: book.title,
                cover: book.cover_i
                    ? `http://covers.openlibrary.org/b/id/${book.cover_i}.jpg`
                    : "",
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

async function searchMovies(query: string, page: number = 1): Promise<any[]> {
    try {
        const TMDB_API_KEY = process.env.TMDB_API_KEY;

        const encodedQuery = encodeURIComponent(query);

        const response = await axios.get(
            `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodedQuery}&page=${page}`
        );

        const movies = response.data.results.map(
            (movie: { title: string; poster_path: string; id: number }) => ({
                title: movie.title,
                cover: movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : "",
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

async function searchGames(query: string, page: number = 1): Promise<any[]> {
    try {
        const IGDB_CLIENT_ID = process.env.IGDB_CLIENT_ID;
        const LIMIT = 20;
        const OFFSET = (page - 1) * LIMIT;

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
                limit ${LIMIT}; 
                offset ${OFFSET};
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
                    : "",
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

async function getTwitchAccessToken(): Promise<string | null> {
    const release = await mutex.acquire();

    try {
        const now = Date.now();

        if (twitchAccessToken && twitchTokenExpiry && twitchTokenExpiry > now) {
            return twitchAccessToken;
        }

        const IGDB_CLIENT_ID = process.env.IGDB_CLIENT_ID;
        const IGDB_CLIENT_SECRET = process.env.IGDB_CLIENT_SECRET;

        const response = await axios.post(
            `https://id.twitch.tv/oauth2/token?client_id=${IGDB_CLIENT_ID}&client_secret=${IGDB_CLIENT_SECRET}&grant_type=client_credentials`
        );

        twitchAccessToken = response.data.access_token;
        twitchTokenExpiry = now + (response.data.expires_in - 60) * 1000;

        return twitchAccessToken;
    } catch (error) {
        console.error("Error getting Twitch OAuth Token:", error);
        return null;
    } finally {
        release();
    }
}

async function findWorkInstanceByUserIdAndApiId(
    api_key: string,
    workInstances: any
): Promise<any | null> {
    try {
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

async function getBookFromAPI(apiId: string) {
    try {
        const response = await fetch(
            `https://openlibrary.org/works/${apiId}.json`
        );
        if (!response.ok) {
            throw new Error("Failed to fetch data from OpenLibrary");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        return [];
    }
}

async function getMovieFromAPI(apiId: string) {
    try {
        const TMDB_API_KEY = process.env.TMDB_API_KEY;
        const response = await fetch(
            `https://api.themoviedb.org/3/movie/${apiId}?append_to_response=credits&api_key=${TMDB_API_KEY}`
        );
        if (!response.ok) {
            throw new Error("Failed to fetch data from TMDB");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        return [];
    }
}

async function getGameFromAPI(apiId: string) {
    try {
        const IGDB_CLIENT_ID = process.env.IGDB_CLIENT_ID;
        const accessToken = await getTwitchAccessToken();

        if (!accessToken) {
            console.error("Could not obtain access token.");
            return [];
        }

        const response = await axios({
            url: `https://api.igdb.com/v4/games`,
            method: "POST",
            headers: {
                "Client-ID": IGDB_CLIENT_ID,
                Authorization: `Bearer ${accessToken}`,
                Accept: "application/json",
            },
            data: `
                fields id, name, summary, first_release_date, cover.url, genres.name,
                involved_companies.company.name, involved_companies.developer,
                involved_companies.publisher;
                where id = ${apiId};
            `,
        });

        return response.data[0];
    } catch (error) {
        return [];
    }
}

export async function getBookAuthorFromAPI(authorId: string) {
    try {
        const response = await fetch(
            `https://openlibrary.org/authors/${authorId}.json`
        );
        if (!response.ok) {
            throw new Error("Failed to fetch data from OpenLibrary");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        return [];
    }
}
