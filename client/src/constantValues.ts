export const DEFAULT_WORK_INSTANCE = Object.freeze({
    rating: 0,
    description: "",
    number_of_completions: 0,
    completions: [],
    status: "todo",
});

export const STATUSES = Object.freeze({
    book: {
        wishlist: "Wishlist",
        todo: "To Read",
        doing: "Reading",
        completed: "Completed",
    },
    movie: {
        wishlist: "Wishlist",
        todo: "To Watch",
        doing: "Watching",
        completed: "Completed",
    },
    game: {
        wishlist: "Wishlist",
        todo: "To Play",
        doing: "Playing",
        completed: "Completed",
    },
});

export const TYPES: [string, string][] = [
    ["book", "Book"],
    ["movie", "Movie"],
    ["game", "Game"],
];
