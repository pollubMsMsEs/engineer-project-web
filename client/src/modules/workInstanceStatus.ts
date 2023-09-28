import { WorkType } from "@/types/types";

export const statuses = {
    book: ["Wishlist", "To Read", "Reading", "Completed"],
    movie: ["Wishlist", "To Watch", "Watching", "Completed"],
    computerGame: ["Wishlist", "To Play", "Playing", "Completed"],
};

export function getNextStatus(type: WorkType, state: string) {
    const index = statuses[type].indexOf(state);

    if (index === -1) return false;

    return statuses[type][index + 1];
}

export function getPreviousStatus(type: WorkType, state: string) {
    const index = statuses[type].indexOf(state);

    if (index === -1) return false;

    return statuses[type][index - 1];
}
