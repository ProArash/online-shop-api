import { requireRole } from "../middlewares/auth.middleware";
import { router } from "../utils/import-router";
import { authRouter } from "./auth.router";
import { productRouter } from "./product.router";
import { telegramRouter } from "./telegram.router";
import { userRouter } from "./user.router";

export const routes = router;

router.use("/api/user", userRouter);
router.use("/api/product", productRouter);
router.use("/api/auth", authRouter);
router.use("/", telegramRouter);
