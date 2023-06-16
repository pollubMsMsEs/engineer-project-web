import { Request, Response, NextFunction, Router } from "express";
import { expressjwt as jwt } from "express-jwt";

export const jwtMiddleware = [
    jwt({ secret: process.env.JWT_KEY!, algorithms: ["HS256"] }),
    (req: Request | any, res: Response, next: NextFunction) => {
        console.log("Authorized:", req.auth);
        next();
    },
    (err: any, req: Request | any, res: Response, next: NextFunction) => {
        console.log("Unauthorized:", req.auth);
        next(err);
    },
];
