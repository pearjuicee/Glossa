// what the backend returns
export type FlashcardApi = {
  flashcard_id: string;
  user_id: string;
  definition: string;
  romanization?: string | null;
  language?: string | null;
  sentence?: string | null;
  target_word?: string | null;
  added_to_anki?: boolean;
  created_at?: string;
  modified_at?: string;
};

// what UI/components use
export type Flashcard = {
  id: string;
  definition: string;
  romanized?: string | null;
  language?: string | null;
  sentence?: string | null;
  targetWord?: string | null;
  addedToAnki?: boolean;
  createdAt?: string;
  modifiedAt?: string;
};

export const mapFlashcard = (a: FlashcardApi): Flashcard => ({
  id: a.flashcard_id,
  definition: a.definition,
  romanized: a.romanization ?? null,
  language: a.language ?? null,
  sentence: a.sentence ?? null,
  targetWord: a.target_word ?? null,
  addedToAnki: a.added_to_anki ?? false,
  createdAt: a.created_at,
  modifiedAt: a.modified_at,
});
