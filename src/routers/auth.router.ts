import { authController } from "../controllers/auth.controller";
import express from 'express'
const router = express.Router()

export const authRouter = router

router.post("/register",authController.register)
router.post("/login",authController.login)