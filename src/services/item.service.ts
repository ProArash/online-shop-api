import { IItem } from "../utils/interfaces";
import { prismaClient } from "../utils/prisma-client";

export const itemService = {
    newItem: async (
        title: string,
        caption: string,
        price: string,
        stock: boolean,
        uid: number,
        cid: number
    ) => {
        const item = await prismaClient().item.findUnique({
            where:{
                title
            }
        })
        if(item){
            return `Item ${title} exsits.`
        }
        return await prismaClient().item.create({
            data: {
                title,
                caption,
                price,
                stock,
                user_id: uid,
                categoryId: cid,
            },
        });
    },
    getItems: async () => {
        return await prismaClient().item.findMany();
    },
    getItemsByUserId: async (pid: number, uid: number) => {
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
    changeItemStatusByUserId: async (pid: number, uid: number) => {
        return await prismaClient().item.update({
            where: {
                id: pid,
                user_id: uid,
            },
            data: {
                stock: true ? false : true,
            },
        });
    },
    updateItemById: async (
        pid: number,
        title: string,
        caption: string,
        price: string,
        stock: boolean,
        uid: number,
        cid: number
    ) => {
        return await prismaClient().item.update({
            where: {
                id: pid,
                user_id: uid,
            },
            data: {
                title,
                caption,
                price,
                stock,
                categoryId: cid,
            },
        });
    },
};
