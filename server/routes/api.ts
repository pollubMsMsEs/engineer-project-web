import { Request, Response, NextFunction, Router } from "express";
import workRouter from "./api/work.js";
import workInstanceRouter from "./api/workInstance.js";
import workFromAPIRouter from "./api/workFromAPI.js";
import personRouter from "./api/person.js";
import imageRouter from "./api/image.js";
import { validationResult } from "express-validator";
import { login, register } from "../controllers/user.js";
import { isValid } from "../controllers/validate.js";
import { jwtMiddleware } from "../middlewares.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);

router.get("/validate", jwtMiddleware, isValid);

router.use("/work", jwtMiddleware, workRouter);
router.use("/workInstance", jwtMiddleware, workInstanceRouter);
router.use("/workFromAPI", jwtMiddleware, workFromAPIRouter);
router.use("/person", jwtMiddleware, personRouter);
router.use("/image", imageRouter);

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
