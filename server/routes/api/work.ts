import { Router } from "express";
import {
    getAllShort,
    getAllPopulated,
    getOne,
    createOne,
    updateOne,
    deleteOne,
    getCount,
    getAllByType,
} from "../../controllers/work.js";

const router = Router();

router.get("/all", getAllPopulated);
router.get("/all/summary", getAllShort);
router.get("/all/:type", getAllByType);
router.get("/count", getCount);
router.get("/:id", getOne);
router.post("/create", createOne);
router.put("/:id", updateOne);
router.delete("/:id", deleteOne);

export default router;
