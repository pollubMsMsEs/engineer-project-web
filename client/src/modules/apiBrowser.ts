import { WorkType } from "@/types/types";

export interface WorkFromAPIShort {
    api_id: string;
    type: WorkType;
    title: string;
    authors: string[];
    cover: string;
}

export async function searchWorks(
    query: string,
    type: WorkType
): Promise<WorkFromAPIShort[] | false> {
    switch (type) {
        case "movie":
            return false;
        case "book":
            return await searchBooks(query);
        case "game":
            return false;
    }
}

async function searchBooks(query: string): Promise<WorkFromAPIShort[] | false> {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_BOOKS_API}/search.json?q=${query}`
    );

    if (!response.ok) {
        try {
            const result = await response.json();
            console.error(result);

            return false;
        } catch (e) {
            console.error(e);
        }

        return false;
    }

    const result: { docs: any[] } = await response.json();

    const books = result.docs.map<WorkFromAPIShort>((work: any) => {
        return {
            api_id: work.key,
            type: "book",
            title: work.title,
            authors: work.author_name,
            cover: work.cover_i
                ? `https://covers.openlibrary.org/b/id/${work.cover_i}.jpg`
                : "",
        };
    });

    return books;
}
