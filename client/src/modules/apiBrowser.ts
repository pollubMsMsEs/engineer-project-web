import { Work, WorkType } from "@/types/types";

export interface WorkFromAPIShort {
    api_key: string;
    type: WorkType;
    title: string;
    cover: string;
    has_instance: boolean;
}

export async function searchWorks(
    query: string,
    type: WorkType
): Promise<WorkFromAPIShort[] | false> {
    const response = await fetch(`/api/search/${type}?query=${query}`);

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

    const result: WorkFromAPIShort[] = await response.json();

    console.log(result);

    return result;
}
