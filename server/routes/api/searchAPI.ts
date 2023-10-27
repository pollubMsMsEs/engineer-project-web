import { Router } from "express";
import { search } from "../../controllers/searchAPI.js";

const router = Router();

router.get("/:type", search);

export default router;
