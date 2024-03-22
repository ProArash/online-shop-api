import { prismaClient } from "../utils/prisma-client";

export const categoryService = {
    newCategory: async (title: string) => {
        const category = await prismaClient().category.findUnique({
            where:{
                title
            }
        })
        if(category){
            return `Category ${title} exists.`
        }
        return await prismaClient().category.create({
            data: {
                title,
            },
        });
    },
};
