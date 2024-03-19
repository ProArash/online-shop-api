import { router } from "../utils/import-router";
import { telegramRouter } from "./telegram.router";

export const routes = router;

router.use("/", telegramRouter);
