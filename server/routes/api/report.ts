import { Router } from "express";
import { handleReport } from "../../controllers/report.js";

const router = Router();

router.get("/:reportType", handleReport);

export default router;
