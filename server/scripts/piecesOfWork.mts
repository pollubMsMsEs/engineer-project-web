type PieceOfWork = {
    title: string;
    description: string;
    published_at: any;
    type?: "computerGame" | "movie" | "book";
    genres: string[];
    people: Object;
    metadata: Object;
    [key: string]: any;
};

export default function getPiecesOfWork(
    dateTransformer: (date: string) => any
): PieceOfWork[] {
    return [
        {
            title: "Minecraft",
            description: "Most popular sandbox game in the world",
            published_at: dateTransformer("2011-11-18"),
            type: "computerGame",
            genres: ["Sandbox", "Survival"],
            people: {
                designers: [
                    { name: "Markus", nick: "Notch", surname: "Persson" },
                    { name: "Jens", nick: "Jeb", surname: "Peder Bergensten" },
                ],
                composers: [
                    { name: "Daniel", nick: "C418", surname: "Rosenfeld" },
                    { name: "Lena", surname: "Raine" },
                    { name: "Kumi", surname: "Tanioka" },
                ],
            },
            metadata: {
                platforms: [
                    "PC",
                    "Mobile phones",
                    "Xbox 360",
                    "Xbox One",
                    "PS3",
                    "PS4",
                    "PS Vita",
                    "Wii U",
                    "Apple TV",
                    "tvOS",
                    "Nintendo Switch",
                ],
                developers: ["Mojang Studios"],
                publishers: [
                    "Mojang Studios",
                    "Xbox Game Studios",
                    "Sony Interactive Entertainment",
                ],
                modes: ["Singleplayer", "Multiplayer"],
            },
        },
        {
            title: "Stardew Valley",
            description:
                "Simulation role-playing video game about simple life on the farm",
            published_at: dateTransformer("2016-02-26"),
            type: "computerGame",
            genres: ["Simulation", "Role-playing"],
            people: {
                designers: [
                    { name: "Eric", nick: "ConcernedApe", surname: "Barone" },
                ],
                composers: [
                    { name: "Eric", nick: "ConcernedApe", surname: "Barone" },
                ],
            },
            metadata: {
                platforms: [
                    "PC",
                    "Mobile phones",
                    "Xbox One",
                    "PS4",
                    "PS Vita",
                    "Nintendo Switch",
                ],
                developers: "ConcernedApe",
                publishers: "ConcernedApe",
                modes: ["Singleplayer", "Multiplayer"],
            },
        },
        {
            title: "The Great Gatsby",
            description: "A novel by F. Scott Fitzgerald",
            published_at: dateTransformer("1925-04-10"),
            type: "book",
            people: {
                authors: [{ name: "Francis", surname: "Scott Fitzgerald" }],
                characters: [
                    { name: "Nick", surname: "Carraway", fictional: true },
                    { name: "Jay", surname: "Gatsby", fictional: true },
                    { name: "Daisy", surname: "Buchanan", fictional: true },
                    { name: "Tom", surname: "Buchanan", fictional: true },
                ],
            },
            genres: ["Novel", "Fiction", "Tragedy"],
            metadata: {
                pages: "208",
                language: "English",
                publishers: "Charles Scribner's Sons",
            },
        },
        {
            title: "The Lord of the Rings: The Fellowship of the Ring",
            description: "A movie directed by Peter Jackson",
            published_at: dateTransformer("2001-12-19"),
            type: "movie",
            people: {
                directors: [{ name: "Peter", surname: "Jackson" }],
                producers: [
                    { name: "Fran", surname: " Walsh" },
                    { name: "Peter", surname: "Jackson" },
                    { name: "Barrie", surname: "Osborne" },
                    { name: "Tim", surname: "Sanders" },
                ],
                actors: [
                    { name: "Sean", surname: "Astin" },
                    { name: "Sean", surname: "Bean" },
                    { name: "Billy", surname: "Boyd" },
                    { name: "Orlando", surname: "Bloom" },
                ],
                screenwriters: [
                    { name: "Fran", surname: "Walsh" },
                    { name: "Philippa", surname: "Boyens" },
                    { name: "Peter", surname: "Jackson" },
                ],
            },
            genres: ["Fantasy", "Action", "Adventure"],
            metadata: {
                distributed_by: "New Line Cinema",
                duration: "178 minutes",
            },
        },
        {
            title: "Super Mario Bros.",
            description: "A computer game developed by Nintendo",
            published_at: dateTransformer("1985-09-13"),
            type: "computerGame",
            genres: ["Platformer"],
            people: {
                designers: [{ name: "Shigeru", surname: "Miyamoto" }],
                composers: [{ name: "Koji", surname: "Kondo" }],
                programmers: [
                    { name: "Toshihiko", surname: "Nakago" },
                    { name: "Kazuaki", surname: "Morita" },
                ],
                producers: [{ name: "Shigeru", surname: "Miyamoto" }],
            },
            metadata: {
                developers: "Nintendo",
                publishers: "Nintendo",
                platforms: [
                    "PC",
                    "Mobile phones",
                    "PS3",
                    "Wii U",
                    "Nintendo Switch",
                ],
                modes: ["Singleplayer", "Multiplayer"],
            },
        },
        {
            title: "Super Mario Bros. 2",
            description: "A sequel to the computer game developed by Nintendo",
            published_at: dateTransformer("1988-10-09"),
            type: "computerGame",
            genres: ["Platformer"],
            people: {
                designers: [
                    { name: "Kensuke", surname: "Tanabe" },
                    { name: "Yasuhisa", surname: "Yamamura" },
                    { name: "Hideki", surname: "Konno" },
                ],
                composers: [{ name: "Koji", surname: "Kondo" }],
                programmers: [
                    { name: "Toshihiko", surname: "Nakago" },
                    { name: "Yasunori", surname: "Taketani" },
                    { name: "Toshio", surname: "Iwawaki" },
                ],
                producers: [{ name: "Shigeru", surname: "Miyamoto" }],
            },
            metadata: {
                developers: "Nintendo",
                publishers: "Nintendo",
                platforms: [
                    "PC",
                    "Mobile phones",
                    "PS3",
                    "Wii U",
                    "Nintendo Switch",
                ],
                modes: ["Singleplayer", "Multiplayer"],
            },
        },
        {
            title: "The Catcher in the Rye",
            description: "A novel by J.D. Salinger",
            published_at: dateTransformer("1951-07-16"),
            type: "book",
            genres: ["Novel"],
            people: {
                authors: [{ name: "Jerome David", surname: "Salinger" }],
                characters: [
                    { name: "Holden", surname: "Caulfield", fictional: true },
                    { name: "Jane", surname: "Gallagher", fictional: true },
                    { name: "Sally", surname: "Hayes", fictional: true },
                ],
            },
            metadata: {
                pages: "234",
                language: "English",
                publishers: "Little, Brown and Company",
            },
        },
        {
            title: "The Godfather",
            description: "A movie directed by Francis Ford Coppola",
            published_at: dateTransformer("1972-03-24"),
            type: "movie",
            genres: ["Drama", "Gangster"],
            people: {
                directors: [{ name: "Francis", surname: "Coppola" }],
                producers: [{ name: "Albert", surname: "Ruddy" }],
                actors: [
                    { name: "Marlon", surname: "Brando" },
                    { name: "Al", surname: "Pacino" },
                    { name: "James", surname: "Caan" },
                    { name: "Richard", surname: "Castellano" },
                    { name: "Robert", surname: "Duvall" },
                    { name: "Sterling", surname: "Hayden" },
                ],
                screenwriters: [
                    { name: "Mario", surname: "Pozu" },
                    { name: "Francis", surname: "Coppola" },
                ],
            },
            metadata: {
                duration: "175 minutes",
                distributed_by: "Paramount Pictures",
            },
        },
        {
            title: "The Godfather: Part II",
            description:
                "A sequel to the movie directed by Francis Ford Coppola",
            published_at: dateTransformer("1974-12-20"),
            type: "movie",
            genres: ["Drama", "Gangster"],
            people: {
                directors: [{ name: "Francis", surname: "Coppola" }],
                producers: [{ name: "Francis", surname: "Coppola" }],
                actors: [
                    { name: "Al", surname: "Pacino" },
                    { name: "Robert", surname: "Duvall" },
                    { name: "Diane", surname: "Keaton" },
                    { name: "Robert", surname: "De Niro" },
                    { name: "Talia", surname: "Shire" },
                    { name: "Morgana", surname: "King" },
                    { name: "John", surname: "Cazale" },
                    { name: "Mariana", surname: "Hill" },
                    { name: "Lee", surname: "Strasberg" },
                ],
                screenwriters: [
                    { name: "Mario", surname: "Pozu" },
                    { name: "Francis", surname: "Coppola" },
                ],
            },
            metadata: {
                duration: "202 minutes",
                distributed_by: "Paramount Pictures",
            },
        },
        {
            title: "To Kill a Mockingbird",
            description: "A novel by Harper Lee",
            published_at: dateTransformer("1960-07-11"),
            type: "book",
            genres: ["Novel"],
            people: {
                authors: [{ name: "Harper", surname: "Lee" }],
                characters: [
                    { name: "Atticus", surname: "Finch", fictional: true },
                    { name: "Jean Louise", surname: "Finch", fictional: true },
                    { name: "Jem", surname: "Finch", fictional: true },
                    { name: "Arthur", surname: "Radley", fictional: true },
                    { name: "Tom", surname: "Robinson", fictional: true },
                    { name: "Mayella", surname: "Ewell", fictional: true },
                    { name: "Bob", surname: "Ewell", fictional: true },
                    { name: "Aunt", surname: "Alexandra", fictional: true },
                    {
                        name: "Miss Maudie",
                        surname: "Atkinson",
                        fictional: true,
                    },
                ],
            },
            metadata: {
                pages: "281",
                language: "English",
                publishers: "J. B. Lippincott & Co.",
            },
        },
        {
            title: "The Godfather: Part III",
            description:
                "A sequel to the movie directed by Francis Ford Coppola",
            published_at: dateTransformer("1990-12-20"),
            type: "movie",
            genres: ["Drama", "Gangster"],
            people: {
                directors: [{ name: "Francis", surname: "Coppola" }],
                producers: [{ name: "Francis", surname: "Coppola" }],
                actors: [
                    { name: "Al", surname: "Pacino" },
                    { name: "Diane", surname: "Keaton" },
                    { name: "Talia", surname: "Shire" },
                    { name: "Andy", surname: "García" },
                    { name: "Eli", surname: "Wallach" },
                    { name: "Joe", surname: "Mantegna" },
                    { name: "Bridget", surname: "Fonda" },
                    { name: "George", surname: "Hamilton" },
                    { name: "Sofia", surname: "Coppola" },
                ],
                screenwriters: [
                    { name: "Mario", surname: "Pozu" },
                    { name: "Francis", surname: "Coppola" },
                ],
            },
            metadata: {
                duration: "162 minutes",
                distributed_by: "Paramount Pictures",
            },
        },
        {
            title: "Far Cry 5",
            description:
                "A first-person shooter video game developed by Ubisoft Montreal and published by Ubisoft",
            published_at: dateTransformer("2018-03-27"),
            type: "computerGame",
            genres: ["Action", "Adventure", "First-person shooter"],
            people: {
                designers: [
                    { name: "Russ", surname: "Flaherty" },
                    { name: "Kyle", surname: "Kotevich" },
                    { name: "Andrejs", surname: "Verlis" },
                ],
                composers: [{ name: "Dan", surname: "Romero" }],
                programmers: [
                    { name: "Cedric", surname: "Decelle" },
                    { name: "Christian", surname: "Carriere" },
                ],
                producers: [
                    { name: "Darryl", surname: "Long" },
                    { name: "Gordana", surname: "Vrbanc-Duquet" },
                ],
            },
            metadata: {
                developers: "Ubisoft Montreal",
                publishers: "Ubisoft",
                platforms: ["PC", "PlayStation 4", "Xbox One"],
                modes: ["Single-player", "Multiplayer"],
            },
        },
        {
            title: "Wolfenstein II: The New Colossus",
            description:
                "A first-person shooter game developed by MachineGames",
            published_at: dateTransformer("2014-05-20"),
            type: "computerGame",
            genres: ["FPS"],
            people: {
                designers: [
                    { name: "Andreas", surname: "Öjerfors" },
                    { name: "Arcade", surname: "Berg" },
                    { name: "Aydin", surname: "Afzoud" },
                ],
                composers: [
                    { name: "Mick", surname: "Gordon" },
                    { name: "Martin", surname: "Andersen" },
                ],
                programmers: [{ name: "Jim", surname: "Kjellin" }],
                producers: [{ name: "John", surname: "Jennings" }],
            },
            metadata: {
                developers: "MachineGames",
                publishers: "Bethesda Softworks",
                platforms: ["PC", "PS3", "PS4", "Xbox 360", "Xbox One"],
                modes: ["Singleplayer"],
            },
        },
        {
            title: "Watch Dogs 2",
            description:
                "An action-adventure game set in an open world environment, played from a third-person perspective",
            published_at: dateTransformer("2016-11-15"),
            type: "computerGame",
            genres: ["Action", "Adventure"],
            people: {
                designers: [{ name: "Alexandre", surname: "Pedneault" }],
                composers: [{ name: "Hudson", surname: "Mohawke" }],
                programmers: [{ name: "Lucien", surname: "Soulban" }],
                producers: [{ name: "Dominic", surname: "Guay" }],
            },
            metadata: {
                developers: "Ubisoft Montreal",
                publishers: "Ubisoft",
                platforms: ["PlayStation 4", "Xbox One", "PC"],
                modes: ["Singleplayer", "Multiplayer"],
            },
        },
        {
            title: "Harry Potter and the Philosopher's Stone",
            description: "A fantasy movie based on the novel by J.K. Rowling",
            published_at: dateTransformer("2001-11-04"),
            type: "movie",
            genres: ["Fantasy", "Adventure"],
            people: {
                directors: [{ name: "Chris", surname: "Columbus" }],
                producers: [
                    { name: "David", surname: "Heyman" },
                    { name: "Chris", surname: "Columbus" },
                ],
                actors: [
                    { name: "Daniel", surname: "Radcliffe" },
                    { name: "Emma", surname: "Watson" },
                    { name: "Rupert", surname: "Grint" },
                    { name: "Richard", surname: "Harris" },
                    { name: "Maggie", surname: "Smith" },
                    { name: "Alan", surname: "Rickman" },
                    { name: "Robbie", surname: "Coltrane" },
                    { name: "Ian", surname: "Hart" },
                ],
                screenwriters: [{ name: "Steve", surname: "Kloves" }],
            },
            metadata: {
                duration: "152 minutes",
                distributed_by: "Warner Bros. Pictures",
            },
        },
        {
            title: "Transformers: The Last Knight",
            description:
                "A science-fiction action movie based on the Transformers toy franchise",
            published_at: dateTransformer("2017-06-20"),
            type: "movie",
            genres: ["Science Fiction", "Action"],
            people: {
                directors: [{ name: "Michael", surname: "Bay" }],
                producers: [
                    { name: "Don", surname: "Murphy" },
                    { name: "Tom", surname: "DeSanto" },
                    { name: "Lorenzo", surname: "di Bonaventura" },
                    { name: "Ian", surname: "Bryce" },
                ],
                actors: [
                    { name: "Mark", surname: "Wahlberg" },
                    { name: "Anthony", surname: "Hopkins" },
                    { name: "Josh", surname: "Duhamel" },
                    { name: "Laura", surname: "Haddock" },
                    { name: "Isabela", surname: "Merced" },
                    { name: "Jerrod", surname: "Carmichael" },
                    { name: "Santiago", surname: "Cabrera" },
                    { name: "John", surname: "Turturro" },
                ],
                screenwriters: [
                    { name: "Art", surname: "Marcum" },
                    { name: "Matt", surname: "Holloway" },
                    { name: "Ken", surname: "Nolan" },
                ],
            },
            metadata: {
                duration: "154 minutes",
                distributed_by: "Paramount Pictures",
            },
        },
        {
            title: "Harry Potter and the Chamber of Secrets",
            description: "A fantasy novel by J.K. Rowling",
            published_at: dateTransformer("1998-07-02"),
            type: "book",
            genres: ["Fantasy"],
            people: {
                authors: [{ name: "J.K.", surname: "Rowling" }],
                characters: [
                    { name: "Harry", surname: "Potter", fictional: true },
                    { name: "Ron", surname: "Weasley", fictional: true },
                    { name: "Hermione", surname: "Granger", fictional: true },
                    { name: "Albus", surname: "Dumbledore", fictional: true },
                    { name: "Ginny", surname: "Weasley", fictional: true },
                    { name: "Draco", surname: "Malfoy", fictional: true },
                    { name: "Rubeus", surname: "Hagrid", fictional: true },
                    { name: "Tom", surname: "Riddle", fictional: true },
                    { name: "Molly", surname: "Weasley", fictional: true },
                    { name: "Arthur", surname: "Weasley", fictional: true },
                ],
            },
            metadata: {
                pages: "341",
                language: "English",
                publishers: "Bloomsbury",
            },
        },
        {
            title: "Lalka",
            description: "Novel by Bolesław Prus",
            published_at: dateTransformer("1890-01-01"),
            type: "book",
            genres: ["Novel"],
            people: {
                authors: [{ name: "Bolesław", surname: "Prus" }],
                characters: [
                    { name: "Stanisław", surname: "Wokulski", fictional: true },
                    { name: "Ignacy", surname: "Rzecki", fictional: true },
                    { name: "Julian", surname: "Ochocki", fictional: true },
                ],
            },
            metadata: {
                pages: "668",
                language: "Polish",
                publishers: "GREG",
            },
        },
        {
            title: "Harry Potter and the Cursed Child",
            description:
                "The story is set nineteen years after the events of Harry Potter and the Deathly Hallows",
            published_at: dateTransformer("2016-07-30"),
            type: "book",
            genres: ["Fantasy", "Drama", "Adventure"],
            people: {
                authors: [{ name: "Jack", surname: "Throne" }],
                characters: [
                    { name: "Harry", surname: "Potter", fictional: true },
                    { name: "Albus", surname: "Potter", fictional: true },
                    { name: "Scorpius", surname: "Malfoy", fictional: true },
                    { name: "Hermione", surname: "Granger", fictional: true },
                    { name: "Ron", surname: "Weasley", fictional: true },
                    { name: "Ginny", surname: "Weasley", fictional: true },
                    { name: "Draco", surname: "Malfoy", fictional: true },
                    { name: "Cedric", surname: "Diggory", fictional: true },
                    { name: "Delphi", surname: "Diggory", fictional: true },
                ],
            },
            metadata: {
                pages: "336",
                language: "English",
                publishers: "West End",
            },
        },
    ];
}
