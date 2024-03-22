import { Request, Response } from "express";
import { userService } from "../services/user.service";

export const userController = {
    getUsers: async (req: Request, res: Response) => {
        try {
            const users = await userService.getUsers();
            res.status(200).json({
                data: users,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                data: error || "Internal error.",
            });
        }
    },
    getUserById: async (req: Request, res: Response) => {
        try {
            const users = await userService.getUsers();
            res.status(200).json({
                data: users,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                data: error || "Internal error.",
            });
        }
    },
    updateUserById: async (req: Request, res: Response) => {
        try {
            const users = await userService.getUsers();
            res.status(200).json({
                data: users,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                data: error || "Internal error.",
            });
        }
    },
    deleteUserById: async (req: Request, res: Response) => {
        try {
            //@ts-ignore
            const { username } = req.user;
            const users = await userService.deleteUserByUsername(username);
            res.status(200).json({
                data: users,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                data: error || "Internal error.",
            });
        }
    },
};
