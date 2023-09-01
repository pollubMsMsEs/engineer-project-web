import { Router } from "express";
import {
    getAll,
    getAllForUser,
    getOne,
    createOne,
    updateOne,
    deleteOne,
} from "../../controllers/pieceOfWorkInstance.js";

const router = Router();

router.get("/all", getAll);
router.get("/all/:id", getAllForUser);
router.post("/create", createOne);
router.get("/:id", getOne);
router.put("/:id", updateOne);
router.delete("/:id", deleteOne);

export default router;
