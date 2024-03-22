import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient | null = null;

export const prismaClient = () => {
    if (prisma === null) prisma = new PrismaClient();
    return prisma;
};
