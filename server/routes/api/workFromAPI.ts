import { Router } from "express";
import {
    getAll,
    getAllByType,
    getOne,
    createOne,
    updateOne,
    deleteOne,
} from "../../controllers/workFromAPI.js";

const router = Router();

router.get("/all", getAll);
router.get("/all/:type", getAllByType);
router.post("/create", createOne);
router.get("/:id", getOne);
router.put("/:id", updateOne);
router.delete("/:id", deleteOne);

export default router;
