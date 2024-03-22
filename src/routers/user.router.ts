import { userController } from "../controllers/user.controller";
import { requireRole } from "../middlewares/auth.middleware";
import express from 'express'
const router = express.Router()

export const userRouter = router;

router.get("/", requireRole("ADMIN"), userController.getUsers);
router.delete("/:uid", requireRole("USER"), userController.deleteUserById);
router.put("/:uid", requireRole("USER"), userController.updateUserById);
