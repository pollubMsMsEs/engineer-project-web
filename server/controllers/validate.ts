import { Request, Response, NextFunction } from "express";

export async function isValid(req: Request, res: Response) {
    res.sendStatus(200);
}
