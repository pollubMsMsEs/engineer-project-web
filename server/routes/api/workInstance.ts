import { Router } from "express";
import {
    getAll,
    getOne,
    createOne,
    updateOne,
    deleteOne,
    getAllForCurrentUser,
    countAllForCurrentUserByTypeAndStatus,
} from "../../controllers/workInstance.js";

const router = Router();

router.get("/all", getAll);
router.get("/me", getAllForCurrentUser);
router.post("/create", createOne);
router.get("/count", countAllForCurrentUserByTypeAndStatus);
router.get("/:id", getOne);
router.put("/:id", updateOne);
router.delete("/:id", deleteOne);

export default router;
