import { Router } from "express";
import { handleCreateFlashcard } from "../controllers/flashcardController";
import { supabaseAuth } from "../middleware/supabaseAuth";

const router = Router();

router.post("/createFlashcard", supabaseAuth, handleCreateFlashcard);

export default router;
