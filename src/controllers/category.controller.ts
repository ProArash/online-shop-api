import { Request, Response } from "express";
import { categoryService } from "../services/category.service";

export const categoryController = {
    newCategory: async (req: Request, res: Response) => {
        try {
            const { title } = req.body;
            console.log(1);
            console.log(req.originalUrl)
            const category = await categoryService.newCategory(title);
            res.status(200).json({
                data: category,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                data: "Internal error.",
            });
        }
    },
};
