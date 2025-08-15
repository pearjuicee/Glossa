import { Request, Response } from "express";
import { createFlashcard } from "../services/flashCardService";

export const handleCreateFlashcard = async (req: Request, res: Response) => {
  console.log("Received request to create flashcard:", req.body);
  try {
    const {
      user_id,
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
