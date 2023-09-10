import Work from "../models/work.js";
import Person from "../models/person.js";
import getWork from "./piecesOfWork.mjs";
import { inspect } from "util";
import Debug from "debug";
import { Types } from "mongoose";
const debug = Debug("project:db");
const debugDev = Debug("project:dev");

type WorkMetadata = {
    _id?: Types.ObjectId;
    title: string;
    dev: boolean;
    description: string;
    published_at: Date;
    genres: String[];
    metadata: Map<string, string[]>;
    people: PersonInWork[];
};

type PersonInWork = {
    person_id?: Types.ObjectId;
    person?: { name: string; surname: string };
    role: string;
    details?: Map<string, string[]>;
};

export async function deleteEverything() {
    await Work.deleteMany({});
    await Person.deleteMany({});
    debug("Deleted all documents");
}

export async function populateDB() {
    const works = transformWork();

    const worksWithPeopleIds = await Promise.all(
        works.map(async (m) => {
            m.people = await Promise.all(
                m.people.map(async (personInWork) => {
                    const id = (
                        await Person.findOneAndUpdate(
                            personInWork.person!,
                            personInWork.person!,
                            {
                                new: true,
                                upsert: true,
                            }
                        )
                    )._id;
                    personInWork.person_id = id;
                    return personInWork;
                })
            );

            return m;
        })
    );
    debug("Inserted people documents");

    Work.insertMany(worksWithPeopleIds);

    debug("Inserted works documents");
}

function transformWork(): WorkMetadata[] {
    const piecesOfWork = getWork((date) => new Date(date));
    const works = piecesOfWork
        .filter((p) => p.type === "movie")
        .map((p) => {
            const transformedPeople: PersonInWork[] = [];
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

            return p as unknown as WorkMetadata;
        });

    return works;
}
