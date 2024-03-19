import { Request, Response } from "express";

export const telegramController = {
    processMessage: async (req: Request, res: Response) => {
        try {
            
        } catch (error) {
            console.log(error);
            res.status(500).json({
                data: error || "Internal error",
            });
        }
    },
};
