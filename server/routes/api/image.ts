import { Router } from "express";
import {
    getAll,
    getCount,
    getOne,
    createOne,
    updateOne,
    deleteOne,
    showOne,
} from "../../controllers/image.js";

const router = Router();

router.get("/all", getAll);
router.get("/count", getCount);
router.get("/get/:id", getOne);
router.post("/create", createOne);
router.put("/:id", updateOne);
router.delete("/:id", deleteOne);
router.get("/:id", showOne);

export default router;
