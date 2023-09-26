export interface Work {
    _id?: string;
    title: string;
    cover?: string;
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
    number_of_viewings: number;
    viewings: Date[];
    status: string;
    type: "movie" | "book" | "computerGame";
    from_api: boolean;
}

export interface MetaObject {
    [key: string]: string[];
}

export type WorkFromAPI = Work & {
    people: (PersonInWork & { person_id: string })[];
};

export type WorkFromAPIPopulated = Work & {
    people: (PersonInWork & { person_id: PersonFromAPI })[];
};

export type PersonFromAPI = Person & { _id: string };

export type WorkInstanceFromAPI = WorkInstance & {
    _id: string;
    user_id: string;
    work_id: WorkFromAPI;
};
