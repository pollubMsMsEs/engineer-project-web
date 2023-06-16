import { Request, Response, NextFunction, Router } from "express";
import movieRouter from "./api/movie.js";
import personRouter from "./api/person.js";
import { validationResult } from "express-validator";
import { login, register } from "../controllers/user.js";

import { error } from "console";
import { jwtMiddleware } from "../middlewares.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);

router.use("/movie", jwtMiddleware, movieRouter);
router.use("/person", jwtMiddleware, personRouter);

router.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const valResult = validationResult(req);
    if (!valResult.isEmpty()) {
        return res
            .status(422)
            .json({ acknowledged: false, errors: err.errors });
    }

    if (err.status === 401) {
        return res.status(401).json({
            acknowledged: false,
            errors: [
                {
                    msg: err.inner.message,
                },
            ],
        });
    }

    return next(err);
});

export default router;
