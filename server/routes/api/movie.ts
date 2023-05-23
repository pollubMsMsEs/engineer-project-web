import { Router } from "express";
import {
    getAllShort,
    getAllPopulated,
    getOne,
} from "../../controllers/movie.js";

const router = Router();

router.get("/all", getAllPopulated);
router.get("/all/summary", getAllShort);
router.get("/:id", getOne);

export default router;
