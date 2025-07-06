import prisma from "../lib/prisma";

export const createFlashcard = async (data: {
  user_id?: string;
  sentence: string;
  target_word: string;
  definition: string;
  romanization?: string;
  language?: string;
  added_to_anki: boolean;
}) => {
  const flashcard = await prisma.flashcards.create({
    data,
  });
  return flashcard;
};
