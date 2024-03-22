import { userController } from "../controllers/user.controller";
import { requireRole } from "../middlewares/auth.middleware";
import { router } from "../utils/import-router";

export const userRouter = router;

router.get("/", requireRole("ADMIN"), userController.getUsers);
router.delete("/:uid", requireRole("USER"), userController.deleteUserById);
router.put("/:uid", requireRole("USER"), userController.updateUserById);
