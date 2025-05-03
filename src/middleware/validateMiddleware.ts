import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export default function validateRequest(req: Request, res: Response, next: NextFunction): void {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // @ts-ignore
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}
