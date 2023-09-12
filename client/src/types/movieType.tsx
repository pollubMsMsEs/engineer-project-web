export interface Movie {
    _id?: string;
    title: string;
    dev: boolean;
    description: string;
    published_at: Date;
    genres: string[];
    metadata: MetaObject;
}

export interface PersonInMovie {
    role: string;
    details?: MetaObject;
}

export interface Person {
    name: string;
    nick?: string;
    surname: string;
}

export type PersonFromAPI = Person & { _id: string };

export interface MetaObject {
    [key: string]: string[];
}

export type PopulatedMovieFromAPI = Movie & {
    people: (PersonInMovie & { person_id: PersonFromAPI })[];
};
