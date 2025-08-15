import { Router } from "express";
import { handleCreateFlashcard } from "../controllers/flashcardController";

const router = Router();

router.post("/", handleCreateFlashcard);

export default router;
