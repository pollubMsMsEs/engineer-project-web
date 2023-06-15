import { Request, Response, NextFunction, Router } from "express";
import movieRouter from "./api/movie.js";
import personRouter from "./api/person.js";
import { validationResult } from "express-validator";
import { login, register } from "../controllers/user.js";

const router = Router();

router.get("/login", login);
router.get("/register", register);

router.use("/movie", movieRouter);
router.use("/person", personRouter);

router.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const valResult = validationResult(req);
    if (!valResult.isEmpty()) {
        return res
            .status(422)
            .json({ acknowledged: false, errors: err.errors });
    }

    return next(err);
});

export default router;
