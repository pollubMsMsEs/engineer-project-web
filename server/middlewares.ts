import { Request, Response, NextFunction, Router } from "express";
import { expressjwt as jwt } from "express-jwt";

if (!process.env.JWT_KEY) {
    throw new Error("Missing JWT_KEY in env");
}

export const jwtMiddleware = [
    jwt({ secret: process.env.JWT_KEY!, algorithms: ["HS256"] }),
    (req: Request | any, res: Response, next: NextFunction) => {
        next();
    },
    (err: any, req: Request | any, res: Response, next: NextFunction) => {
        next(err);
    },
];
