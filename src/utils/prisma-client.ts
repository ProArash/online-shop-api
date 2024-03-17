import { PrismaClient } from "@prisma/client";

export const prismaClient = () => {
    try {
        let prisma: PrismaClient | null = null;
        if (prisma === null) prisma = new PrismaClient();
        return prisma;
    } catch (error) {
        console.log(error);
    }
};
