import { NextFunction, Request, Response } from "express";

export const reqLogger = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log("Query-> ", req.query);
    console.log("Params-> ", req.params);
    console.log("Body-> ", req.body);
    next();
};
