import { Router } from "express";
import {
    getAll,
    getAllForUser,
    getOne,
    createOne,
    updateOne,
    deleteOne,
    getAllForCurrentUser,
} from "../../controllers/workInstance.js";

const router = Router();

router.get("/all", getAll);
router.get("/all/:id", getAllForUser);
router.get("/me", getAllForCurrentUser);
router.post("/create", createOne);
router.get("/:id", getOne);
router.put("/:id", updateOne);
router.delete("/:id", deleteOne);

export default router;
