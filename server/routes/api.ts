import { Router } from "express";
import movieRouter from "./api/movie.js";

const router = Router();

router.use("/movie", movieRouter);

export default router;
