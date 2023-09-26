import { WorkType } from "@/types/types";

export const states = {
    book: ["Wishlist", "To Read", "Reading", "Completed"],
    movie: ["Wishlist", "To Watch", "Watching", "Completed"],
    computerGame: ["Wishlist", "To Play", "Playing", "Completed"],
};

export function getNextState(type: WorkType, state: string) {
    const index = states[type].indexOf(state);

    if (index === -1) return false;

    return states[type][index + 1];
}

export function getPreviousState(type: WorkType, state: string) {
    const index = states[type].indexOf(state);

    if (index === -1) return false;

    return states[type][index - 1];
}
