export interface Work {
    title: string;
    cover?: string;
    type: WorkType;
    dev: boolean;
    description?: string;
    published_at?: Date;
    genres: string[];
    metadata: MetaObject;
}

export interface PersonInWork {
    role: string;
    details?: MetaObject;
}

export interface Person {
    name: string;
    nick?: string;
    surname: string;
}

export interface WorkInstance {
    rating: number;
    description?: string;
    number_of_completions: number;
    completions: Date[];
    status: WorkInstanceStatus;
    type: WorkType;
    from_api: boolean;
    began_at?: Date;
    finished_at?: Date;
}

export type WorkInstanceStatus = "wishlist" | "todo" | "doing" | "completed";

export type WorkType = "movie" | "book" | "game";

export interface MetaObject {
    [key: string]: string[];
}

export type WorkFromAPI = Work & {
    _id: string;
    people: (PersonInWork & { person_id: string })[];
};

export type WorkFromAPIPopulated = Work & {
    _id: string;
    people: (PersonInWork & { person_id: PersonFromAPI })[];
};

export type PersonFromAPI = Person & { _id: string };

export type WorkInstanceFromAPI<T = WorkFromAPI> = WorkInstance & {
    _id: string;
    user_id: string;
    work_id: T;
};

export interface ErrorObject {
    type: "field" | string;
    value: string;
    msg: string;
    path: string;
    location: string;
}

export type ObjectWithPotentialError =
    | { message: string; acknowledged: false }
    | { error: string }
    | { errors: ErrorObject[] }
    | object;

export type ExtractedErrors = string | ErrorObject[];
