import { categoryController } from "../controllers/category.controller";
import express from 'express'
const router = express.Router()

export const categoryRouter = router;

router.post("/", categoryController.newCategory);
