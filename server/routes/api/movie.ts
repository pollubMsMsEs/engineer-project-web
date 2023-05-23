import { Router } from "express";
import { getAllMovies, getAllWithPeople } from "../../controllers/movie.js";

const router = Router();

router.get("/all", getAllMovies);
router.get("/all/people", getAllWithPeople);

export default router;
