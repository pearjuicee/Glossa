import { Router } from "express";
import deepseekRoutes from "./deepseekRoute";
import flashcardRoutes from "./flashcardRoute";

const router = Router();

router.use("/deepseek", deepseekRoutes);
router.use("/flashcards", flashcardRoutes);

export default router;
