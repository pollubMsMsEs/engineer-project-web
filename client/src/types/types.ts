export interface Work {
    title: string;
    cover?: string;
    type?: string;
    dev: boolean;
    description: string;
    published_at: Date;
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
    status: string;
    type: WorkType;
    from_api: boolean;
}

export type WorkType = "movie" | "book" | "computerGame";

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
