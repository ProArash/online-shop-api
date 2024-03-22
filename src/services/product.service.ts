import { prismaClient } from "../utils/prisma-client";

export const ItemService = {
    newItem: async (
        title: string,
        caption: string,
        price: string,
        stock: boolean,
        category_id: number,
        user_id: number
    ) => {
        return await prismaClient().item.create({
            data: {
                title,
                caption,
                price,
                stock,
                category_id,
                user_id,
            },
        });
    },
    getItems: async (uid?: number) => {
        return await prismaClient().item.findMany({
            where: { user_id: uid },
        });
    },
    getItemByUserId: async (pid: number, uid: number) => {
        return await prismaClient().item.findUnique({
            where: {
                id: pid,
                user_id: uid,
            },
        });
    },
    getItemById: async (pid: number) => {
        return await prismaClient().item.findUnique({
            where: {
                id: pid,
            },
        });
    },
    deleteItemById: async (pid: number) => {
        return await prismaClient().item.delete({
            where: {
                id: pid,
            },
        });
    },
    disableItemById: async (pid: number, uid: number) => {
        return await prismaClient().item.update({
            where: {
                id: pid,
                user_id: uid,
            },
            data: {
                stock: false,
            },
        });
    },
    updateItemById: async (
        pid: number,
        title: string,
        caption: string,
        price: string,
        stock: boolean,
        category_id: number
    ) => {
        return await prismaClient().item.update({
            where: {
                id: pid,
            },
            data: {
                title,
                caption,
                price,
                stock,
                category_id,
            },
        });
    },
    updateItemImage: async (image: any) => {
        //TODO
    },
};
