import { useState, useEffect } from "react"
import FlashcardView from "../components/FlashcardView"
import { supabase } from "../lib/supabaseClient";
import { mapFlashcard, type Flashcard, type FlashcardApi } from "../models/Flashcard";

export default function FlashcardsPage() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const accessToken = (await supabase.auth.getSession()).data.session?.access_token;
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/flashcards/getFlashcards`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization" : `Bearer ${accessToken}`
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch flashcards");
        }

        const data: {flashcards: FlashcardApi[]} = await response.json();
        setFlashcards((data.flashcards ?? []).map(mapFlashcard));
      } catch (error) {
        console.error("Error fetching flashcards:", error);
        setError("Failed to load flashcards");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlashcards();
  }, [])

  const handleDeleteFlashcard = async (id: string) => {
    const prev = flashcards;              // keep for rollback
    setDeletingId(id);
    setFlashcards((cur) => cur.filter((c) => c.id !== id)); // optimistic
    try {
      setError(null);

      const accessToken = (await supabase.auth.getSession()).data.session?.access_token;
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/flashcards/deleteFlashcards`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization" : `Bearer ${accessToken}`
          },
          body: JSON.stringify({ flashcard_ids: [id] }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete flashcard");
      }

      setFlashcards((prev) => prev.filter((fc) => fc.id !== id));
    } catch (error) {
      console.error("Error deleting flashcard:", error);
      setFlashcards(prev); // rollback
      setError("Failed to delete flashcard");
    } finally {
      setDeletingId(null);
    }
  }

  if (isLoading) return <div className="p-6">Loading…</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">My Flashcards</h1>

      {flashcards.length === 0 ? (
        <p className="text-gray-500">No flashcards yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {flashcards.map((fc) => (
            <FlashcardView
              key={fc.id}
              flashcard={fc}
              onEdit={() => {/* open edit */}}
              onDelete={() => {handleDeleteFlashcard(fc.id)}}
            />
          ))}
        </div>
      )}
    </div>
  );
}

