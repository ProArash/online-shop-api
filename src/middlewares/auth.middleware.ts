import { UserRole } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { prismaClient } from "../utils/prisma-client";
import jwt from "jsonwebtoken";
import { SECRET } from "../utils/constants";
import { IUserPayload } from "../utils/interfaces";

export const requireRole = (role: UserRole) => {
    let roles: string[] = [];
    let payload: IUserPayload;

    switch (role) {
        case "ADMIN":
            roles.push(UserRole.ADMIN);
        case "USER":
            roles.push(UserRole.USER);
    }

    return async (req: Request, res: Response, next: NextFunction) => {
        console.log(roles);
        const authHeader = req.headers["authorization"];
        if (!authHeader || !authHeader.includes("Bearer ")) {
            return res.status(401).json({
                data: "token is missing.",
            });
        }
        const token = authHeader?.split(" ")[1];
        try {
            payload = jwt.verify(token!, SECRET) as IUserPayload;
            //@ts-ignore
            req.user = payload; // here we put username decoded from jwt token into custom var req.user
        } catch (error) {
            return res.status(403).json({
                data: "Invalid token.",
            });
        }
        const user = await prismaClient().user.findUnique({
            where: {
                username: payload.username,
            },
        });
        if (user) {
            if (!roles.includes(user.role)) {
                return res.status(403).json({
                    data: "insufficient permission.",
                });
            }
            //@ts-ignore
            req.uid = user.id;
            next();
        }
    };
};
