import { Request, Response, NextFunction, Router } from "express";
import movieRouter from "./api/movie.js";
import personRouter from "./api/person.js";
import { validationResult } from "express-validator";
import { login, register } from "../controllers/user.js";
import { expressjwt as jwt } from "express-jwt";
import { error } from "console";

const router = Router();

router.get("/login", login);
router.get("/register", register);

router.use(
    jwt({ secret: process.env.JWT_KEY!, algorithms: ["HS256"] }),
    (req: Request | any, res: Response, next: NextFunction) => {
        console.log(req.auth);
        next();
    }
);
router.use("/movie", movieRouter);
router.use("/person", personRouter);

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
