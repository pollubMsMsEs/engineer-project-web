import { Router } from "express";
import {
    createOne,
    deleteOne,
    getAll,
    getCount,
    getOne,
    updateOne,
} from "../../controllers/person.js";

const router = Router();

router.get("/all", getAll);
router.get("/count", getCount);
router.get("/:id", getOne);
router.post("/create", createOne);
router.put("/:id", updateOne);
router.delete("/:id", deleteOne);

export default router;
