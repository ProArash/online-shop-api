import { itemController } from "../controllers/item.controller";
import { requireRole } from "../middlewares/auth.middleware";
import express from 'express'
const router = express.Router()

export const itemRouter = router;

router.get("/", itemController.getItems);
// router.get("/:uid", requireRole("USER"), itemController.getItemsByUserId);
// router.get("/:pid", itemController.getItemById);
router.post("/", requireRole("USER"), itemController.newItem);
router.patch("/:pid", itemController.changeItemStatusByUserId);
router.put("/:pid", itemController.updateItemById);
router.delete("/:pid", itemController.deleteItemById);
