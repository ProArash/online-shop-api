import { Request, Response } from "express";
import { itemService } from "../services/item.service";

export const itemController = {
    newItem: async (req: Request, res: Response) => {
        try {
            const { title, caption, price, stock, category_id } = req.body;
            //@ts-ignore
            const {uid} = req;
            const newItem = await itemService.newItem(
                title,
                caption,
                price,
                stock,
                uid,
                category_id
            );
            res.status(200).json({
                data: newItem,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                data: "Internal error.",
            });
        }
    },
    getItems: async (req: Request, res: Response) => {
        try {
            const Items = await itemService.getItems();
            res.status(200).json({
                data: Items,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                data: "Internal error.",
            });
        }
    },
    getItemsByUserId: async (req: Request, res: Response) => {
        try {
            //@ts-ignore
            const {uid} = req;
            const { pid } = req.params;
            const Items = await itemService.getItemsByUserId(
                Number(pid),
                Number(uid)
            );
            res.status(200).json({
                data: Items,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                data: "Internal error.",
            });
        }
    },
    getItemById: async (req: Request, res: Response) => {
        try {
            const { pid } = req.params;
            const Item = await itemService.getItemById(Number(pid));
            res.status(200).json({
                data: Item,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                data: "Internal error.",
            });
        }
    },
    deleteItemById: async (req: Request, res: Response) => {
        try {
            const { pid } = req.params;
            await itemService.deleteItemById(Number(pid));
            res.status(200).json({
                data: `Item ${pid} deleted.`,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                data: "Internal error.",
            });
        }
    },
    changeItemStatusByUserId: async (req: Request, res: Response) => {
        try {
            const { pid } = req.params;
            //@ts-ignore
            const {uid} = req;
            await itemService.changeItemStatusByUserId(
                Number(pid),
                Number(uid)
            );
            res.status(200).json({
                data: `Item ${pid} disabled.`,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                data: "Internal error.",
            });
        }
    },
    updateItemById: async (req: Request, res: Response) => {
        try {
            const { pid } = req.params;
            //@ts-ignore
            const {uid} = req;
            const { title, caption, price, stock, category_id } = req.body;
            const Item = await itemService.updateItemById(
                Number(pid),
                title,
                caption,
                price,
                stock,
                uid,
                category_id
            );
            res.status(200).json({
                data: Item,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                data: "Internal error.",
            });
        }
    },
};
