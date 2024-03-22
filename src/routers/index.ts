import { requireRole } from "../middlewares/auth.middleware";
import express from 'express'
const router = express.Router()
import { authRouter } from "./auth.router";
import { categoryRouter } from "./category.router";
import { itemRouter } from "./item.router";
import { telegramRouter } from "./telegram.router";
import { userRouter } from "./user.router";

export const routes = router;

router.use("/api/auth", authRouter);
router.use("/api/user", userRouter);
router.use("/api/item", itemRouter);
router.use("/api/category", categoryRouter);
// router.use("/", telegramRouter);
