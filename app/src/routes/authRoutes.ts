// @ts-nocheck - Template file, dependencies will be installed when scaffolded
import express from "express";
import { loginUser, registerUser } from "../controllers/authController";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
