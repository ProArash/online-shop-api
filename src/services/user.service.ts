import { IUser } from "../utils/interfaces";
import { prismaClient } from "../utils/prisma-client";
import { prismaExclude } from "../utils/prisma-exclude";

export const userService = {
    getUsers: async () => {
        return await prismaClient().user.findMany({
            select: { ...prismaExclude },
        });
    },
    getUserByUsername: async (username: string) => {
        return await prismaClient().user.findUnique({
            where: {
                username,
            },
            select: { ...prismaExclude },
        });
    },
    updateUserByUsername: async (username: string, user: IUser) => {
        return await prismaClient().user.update({
            where: {
                username,
            },
            data: {
                ...user,
            },
            select: { ...prismaExclude },
        });
    },
    deleteUserByUsername: async (username: string) => {
        return await prismaClient().user.delete({
            where: {
                username,
            },
            select: { ...prismaExclude },
        });
    },
};
