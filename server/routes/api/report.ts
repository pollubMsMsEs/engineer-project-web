import { Router } from "express";
import {
    handleReport,
    getCompletionsSortedByDate,
} from "../../controllers/report.js";

const router = Router();

router.get("/completions", getCompletionsSortedByDate);
router.get("/:reportType", handleReport);

export default router;
