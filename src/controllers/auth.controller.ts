import { Request, Response } from "express";
import { prismaClient } from "../utils/prisma-client";
import  bcrypt  from "bcrypt";
import { IUser } from "../utils/interfaces";
import { tokenGenerator } from "../utils/token-generator";
import { prismaExclude } from "../utils/prisma-exclude";
import { userService } from "../services/user.service";

export const authController = {
    register: async (req: Request, res: Response) => {
        try {
            const { username } = req.body;
            const iuser: IUser = req.body;
            let user = await prismaClient().user.findUnique({
                where: { username },
            });
            if (user) {
                return res.status(400).json({
                    data: `Username ${user.username} exists.`,
                });
            }
            const token = await tokenGenerator({
                username: iuser.username,
                name: iuser.name,
            });
            const hashedPwd = await bcrypt.hash(iuser.password, 10);
            iuser.token = token;
            iuser.password = hashedPwd;
            const newUser = await prismaClient().user.create({
                data: {
                    ...iuser,
                },
                select: {
                    ...prismaExclude,
                },
            });
            res.status(200).json({
                data: newUser,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                data: "Internal error.",
            });
        }
    },
    login: async (req: Request, res: Response) => {
        try {
            const iuser: IUser = req.body;
            const user = await prismaClient().user.findUnique({
                where: {
                    username: iuser.username,
                },
            });
            if (!user) {
                return res.status(404).json({
                    data: "user not found.",
                });
            }
            const result = await bcrypt.compare(iuser.password, user.password);
            if (!result) {
                return res.status(400).json({
                    data: "Invalid username or password.",
                });
            }
            const token = await tokenGenerator({
                username: iuser.username,
                name: iuser.name,
            });
            const login = await prismaClient().user.update({
                where: {
                    username: iuser.username,
                },
                data: {
                    token: token,
                },
                select: {
                    ...prismaExclude,
                },
            });
            res.status(200).json({
                data: {
                    token: login.token,
                },
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                data: "Internal error.",
            });
        }
    },
    currentUser: async (req: Request, res: Response) => {
        try {
            //@ts-ignore
            const { username } = req.user;
            const user = await userService.getUserByUsername(username);
            res.status(200).json({
                data: user,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                data: "Internal error.",
            });
        }
    },
};
