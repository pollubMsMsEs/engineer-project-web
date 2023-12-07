import { WorkType } from "@/types/types";
import { mdiBookOpenVariant, mdiController, mdiMovieOpen } from "@mdi/js";

export function getTypeIcon(workType: WorkType) {
    switch (workType) {
        case "movie":
            return { path: mdiMovieOpen, big: false };
        case "book":
            return { path: mdiBookOpenVariant, big: false };
        case "game":
            return { path: mdiController, big: true };
    }
}
