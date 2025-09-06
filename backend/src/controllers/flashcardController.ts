import { Request, Response } from "express";
import { createFlashcard, getFlashcardsByUser, deleteFlashcardsByIds } from "../services/flashCardService";
import { findOrCreateUser } from "../services/userService";

export const handleCreateFlashcard = async (req: Request, res: Response) => {
  console.log("Received request to create flashcard:", req.body);
  try {
    const supabaseId = req.supabaseUserId;

    const user_id = (await findOrCreateUser(supabaseId as string)).user_id;
    
    const {
      sentence,
      target_word,
      definition,
      romanization,
      language,
      added_to_anki = false,
    } = req.body;

    const flashcard = await createFlashcard({
      user_id,
      sentence,
      target_word,
      definition,
      romanization,
      language,
      added_to_anki,
    });

    res.status(201).json(flashcard);
  } catch (error) {
    console.error("Error creating flashcard:", error);
    res.status(500).json({ error: "Failed to create flashcard" });
  }
};

export const handleGetFlashcards = async (req: Request, res: Response) => {
  try {
    const supabaseId = req.supabaseUserId;
    const user_id = (await findOrCreateUser(supabaseId as string)).user_id;
    const flashcards = await getFlashcardsByUser(user_id as string);

    res.status(200).json({flashcards: flashcards});
  } catch (error) {
    console.error("Error fetching flashcards:", error);
    res.status(500).json({ error: "Failed to fetch all flashcards" });
  }
}

export const handleDeleteFlashcardsByIds = async (req: Request, res: Response) => {
  try {
    const supabaseId = req.supabaseUserId;
    const user_id = (await findOrCreateUser(supabaseId as string)).user_id;
    const { flashcard_ids } = req.body;

    if (!Array.isArray(flashcard_ids) || flashcard_ids.length === 0) {
      res.status(400).json({ error: "flashcard_ids must be a non-empty array" });
    }

    // Call the service to delete the flashcards
    await deleteFlashcardsByIds(user_id as string, flashcard_ids);

    res.status(200).json({ message: "Flashcards deleted successfully" });
  } catch (error) {
    console.error("Error deleting flashcards:", error);
    res.status(500).json({ error: "Failed to delete flashcards" });
  }
}
