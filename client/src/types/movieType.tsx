export interface Movie {
    _id?: string;
    title: string;
    dev: boolean;
    description: string;
    published_at: Date;
    genres: string[];
    metadata: MetaObject;
    people: (PersonInMovie & { person_id?: string | Person })[];
}

export interface MetaObject {
    ["key"]: string[];
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
