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

export const getFlashcardsByUser = async (user_id: string) => {
  const flashcards = await prisma.flashcards.findMany({
    where: { user_id: user_id },
    orderBy: { created_at: "desc" },
  });
  return flashcards;
}

export const deleteFlashcardsByIds = async (user_id: string, flashcard_ids: string[]) => {
  await prisma.flashcards.deleteMany({
    where: {
      user_id: user_id,
      flashcard_id: {
        in: flashcard_ids,
      },
    },
  });
}
