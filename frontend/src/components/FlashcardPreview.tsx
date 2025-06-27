import { useEffect, useState } from "react";
import type { DictionaryResponse } from "../models/DictionaryResponse";
import FlashcardPreviewEdit from "./FlashcardPreviewEdit";
import { Pencil } from "lucide-react";

type FlashcardPreviewProps = {
  isLoading: boolean;
  details: DictionaryResponse | null;
};

const FlashcardPreview: React.FC<FlashcardPreviewProps> = ({
  isLoading,
  details,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localDetails, setLocalDetails] = useState<DictionaryResponse | null>(
    null
  );
  const [isSavingToDB, setIsSavingToDB] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    if (details) {
      setLocalDetails(details);
    }
  }, [details]);

  const handleFlashcardSaveToDB = async () => {
    if (!localDetails) return;

    setIsSavingToDB(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/flashcards`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sentence: localDetails.sentence,
            target_word: localDetails.targetWord,
            definition: localDetails.response.definition,
            romanization: localDetails.response.romanized,
            language: localDetails.response.language,
            added_to_anki: false, // Assuming this is false by default
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save flashcard");
      }

      setSaveMessage("✅ Flashcard saved successfully!");
    } catch (error) {
      console.error("Error saving flashcard:", error);
      setSaveMessage("❌ Failed to save flashcard");
    } finally {
      setIsSavingToDB(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mt-2 p-2 border rounded bg-gray-50 flex items-center space-x-2">
        <div className="animate-spin h-5 w-5 border-t-2 border-blue-500 rounded-full"></div>
        <span>Loading definition...</span>
      </div>
    );
  }

  if (!localDetails) return null;

  return (
    <div className="mt-2 p-2 border rounded bg-gray-50 relative">
      {isEditing && localDetails ? (
        <FlashcardPreviewEdit
          initialDetails={localDetails!}
          onSave={(updatedDetails) => {
            setLocalDetails(updatedDetails);
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <>
          <button
            onClick={() => setIsEditing(true)}
            className="absolute top-2 right-2 p-1 text-gray-600 hover:text-black cursor-pointer"
            aria-label="Edit"
          >
            <Pencil size={18} />
          </button>
          <div>
            <strong>Definition:</strong>{" "}
            <p>{localDetails.response.definition}</p>
            <strong>Romanized:</strong> <p>{localDetails.response.romanized}</p>
            <strong>Language:</strong> <p>{localDetails.response.language}</p>
          </div>
          <button
            onClick={handleFlashcardSaveToDB}
            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
            disabled={isSavingToDB}
          >
            {isSavingToDB ? "Saving..." : "Save Flashcard"}
          </button>
          {saveMessage && (
            <div className="mt-2 text-green-600 font-semibold">
              {saveMessage}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FlashcardPreview;
