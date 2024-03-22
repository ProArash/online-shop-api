import { authController } from "../controllers/auth.controller";
import { router } from "../utils/import-router";

export const authRouter = router

router.post("/register",authController.register)
router.post("/login",authController.login)