import { Router } from "express";
import { deleteEverything, populateDB } from "../scripts/dbUtils.js";

const router = Router();

router.put("/repopulateDB", async (req, res) => {
    await deleteEverything();
    await populateDB();

    res.json({ msg: "Database repopulated" });
});

export default router;
