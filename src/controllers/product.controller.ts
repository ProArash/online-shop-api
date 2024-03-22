import { Request, Response } from "express";
import { productService } from "../services/product.service";

export const productController = {
    getProducts: async (req: Request, res: Response) => {
        try {
            const products = await productService.getProducts();
            res.status(200).json({
                data: products,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                data: "Internal error.",
            });
        }
    },
    getProductsByUserId: async (req: Request, res: Response) => {
        try {
            //@ts-ignore
            const { uid } = req.user;
            const products = await productService.getProductsByUserId(
                Number(uid)
            );
            res.status(200).json({
                data: products,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                data: "Internal error.",
            });
        }
    },
    getProductById: async (req: Request, res: Response) => {
        try {
            const { pid } = req.params;
            const product = await productService.getProductById(Number(pid));
            res.status(200).json({
                data: product,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                data: "Internal error.",
            });
        }
    },
    deleteProductById: async (req: Request, res: Response) => {
        try {
            const { pid } = req.params;
            await productService.deleteProductById(Number(pid));
            res.status(200).json({
                data: `product ${pid} deleted.`,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                data: "Internal error.",
            });
        }
    },
    updateProductById: async (req: Request, res: Response) => {
        try {
            const { pid } = req.params;
            const { title, caption, price, stock, category } =
                req.body;
            const product = await productService.updateProductById(
                Number(pid),
                title,
                caption,
                price,
                stock,
                category
            );
            res.status(200).json({
                data: product,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                data: "Internal error.",
            });
        }
    },
};
