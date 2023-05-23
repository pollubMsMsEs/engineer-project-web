import Movie from "../models/movie.js";
import Person from "../models/person.js";
import getPiecesOfWork from "./piecesOfWork.mjs";
import { inspect } from "util";
import Debug from "debug";
import { Types } from "mongoose";
const debug = Debug("db");
const debugDev = Debug("dev");

type MovieMetadata = {
    _id?: Types.ObjectId;
    title: string;
    dev: boolean;
    description: string;
    published_at: Date;
    genres: String[];
    metadata: Map<string, string[]>;
    people: PersonInMovie[];
};

type PersonInMovie = {
    person_id?: Types.ObjectId;
    person?: { name: string; surname: string };
    role: string;
    details?: Map<string, string[]>;
};

export async function deleteEverything() {
    await Movie.deleteMany({});
    await Person.deleteMany({});
    debug("Deleted all documents");
}

export async function populateDB() {
    const movies = transformPiecesOfWork();

    const moviesWithPeopleIds = await Promise.all(
        movies.map(async (m) => {
            m.people = await Promise.all(
                m.people.map(async (personInMovie) => {
                    const id = (
                        await Person.findOneAndUpdate(
                            personInMovie.person!,
                            personInMovie.person!,
                            {
                                new: true,
                                upsert: true,
                            }
                        )
                    )._id;
                    personInMovie.person_id = id;
                    return personInMovie;
                })
            );

            return m;
        })
    );
    debug("Inserted people documents");

    Movie.insertMany(moviesWithPeopleIds);

    debug("Inserted movies documents");
}

function transformPiecesOfWork(): MovieMetadata[] {
    const piecesOfWork = getPiecesOfWork((date) => new Date(date));
    const movies = piecesOfWork
        .filter((p) => p.type === "movie")
        .map((p) => {
            const transformedPeople: PersonInMovie[] = [];
            for (const [role, people] of Object.entries(p.people)) {
                for (const person of people) {
                    transformedPeople.push({
                        person,
                        role: role.slice(0, -1),
                    });
                }
            }
            p.people = transformedPeople;
            p.metadata = new Map(Object.entries(p.metadata));
            p.dev = true;
            delete p.type;

            return p as unknown as MovieMetadata;
        });

    return movies;
}
