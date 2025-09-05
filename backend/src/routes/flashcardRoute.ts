import { Router } from "express";
import { handleCreateFlashcard, handleGetFlashcards, handleDeleteFlashcardsByIds } from "../controllers/flashcardController";
import { supabaseAuth } from "../middleware/supabaseAuth";

const router = Router();

router.post("/createFlashcard", supabaseAuth, handleCreateFlashcard);
router.get("/getFlashcards", supabaseAuth, handleGetFlashcards);
router.delete("/deleteFlashcards", supabaseAuth, handleDeleteFlashcardsByIds);

export default router;
