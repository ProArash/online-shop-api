import { Telegraf } from "telegraf";
import { ITelegramUser } from "../utils/interfaces";
import { prismaClient } from "../utils/prisma-client";

export const telegramUserService = {
    getUsers: async (uid: string) => {
        return await prismaClient().telegramUser.findMany();
    },
    newUser: async (telegramUser: ITelegramUser) => {
        return await prismaClient().telegramUser.create({
            data: {
                ...telegramUser,
            },
        });
    },
    updateUserByUid: async (uid: string, telegramUser: ITelegramUser) => {
        return await prismaClient().telegramUser.update({
            where: {
                uid,
            },
            data: {
                ...telegramUser,
            },
        });
    },
    processMessage:async(bot:Telegraf)=>{
        
    }
};
