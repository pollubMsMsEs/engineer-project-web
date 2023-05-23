import { Router } from "express";
import { getAllShort, getAllPopulated } from "../../controllers/movie.js";

const router = Router();

router.get("/all", getAllPopulated);
router.get("/all/summary", getAllShort);

export default router;
