import { Router } from "express";
import deepseekRoutes from "./deepseekRoute";
import flashcardRoutes from "./flashcardRoute";
import userRoutes from "./users";

const router = Router();

router.use("/deepseek", deepseekRoutes);
router.use("/flashcards", flashcardRoutes);
router.use("/users", userRoutes);

export default router;
