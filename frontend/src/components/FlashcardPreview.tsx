import { useEffect, useState } from "react";
import type { DictionaryResponse } from "../models/DictionaryResponse";
import FlashcardPreviewEdit from "./FlashcardPreviewEdit";
import { Pencil } from "lucide-react";
import SuccessMessage from "./SuccessMessage";
import ErrorMessage from "./ErrorMessage";
import { supabase } from "../lib/supabaseClient";
import { checkAnkiConnection } from "../lib/ankiBridge";

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
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isAnkiConnected, setIsAnkiConnected] = useState<boolean | null>(null);

  useEffect(() => {
    if (details) {
      setLocalDetails(details);
    }
    (async () => {
      try {
        await checkAnkiConnection();
        setIsAnkiConnected(true);
      } catch (error) {
        setIsAnkiConnected(false);
      }
    })();
  }, [details]);

  const handleFlashcardSaveToDB = async () => {
    if (!localDetails) return;

    setIsSavingToDB(true);
    try {
      const accessToken = (await supabase.auth.getSession()).data.session
        ?.access_token;
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/flashcards/createFlashcard`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
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

      setSaveSuccess("Flashcard saved successfully!");
    } catch (error) {
      setSaveError("Failed to save flashcard");
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
          <button
            onClick={async () => {}}
            className="mt-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer"
            disabled={!isAnkiConnected}
          >
            {isAnkiConnected ? "Save to Anki" : "Anki Not Connected"}
          </button>
        </>
      )}

      {saveSuccess && (
        <SuccessMessage
          message={saveSuccess}
          onClose={() => setSaveSuccess(null)}
          duration={3000}
        />
      )}

      {saveError && (
        <ErrorMessage
          message={saveError}
          onClose={() => setSaveError(null)}
          duration={3000}
        />
      )}
    </div>
  );
};

export default FlashcardPreview;
