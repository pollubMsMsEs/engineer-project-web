export interface Movie {
    _id?: string;
    title: string;
    dev: boolean;
    description: string;
    published_at: Date;
    genres: string[];
    metadata: { ["key"]: string[] };
    people: PersonInMovie[];
}

export interface PersonInMovie {
    person_id?: string | { name: string; nick?: string; surname: string };
    role: string;
    details?: { ["key"]: string[] };
}
