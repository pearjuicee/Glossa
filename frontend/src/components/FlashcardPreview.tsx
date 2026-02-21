import { useEffect, useState } from "react";
import type { DictionaryResponse } from "../models/DictionaryResponse";
import FlashcardPreviewEdit from "./FlashcardPreviewEdit";
import { Pencil } from "lucide-react";
import SuccessMessage from "./SuccessMessage";
import ErrorMessage from "./ErrorMessage";
import { supabase } from "../lib/supabaseClient";
import {
  checkAnkiConnection,
  saveNoteToAnki,
  type AnkiNote,
} from "../lib/ankiBridge";

type FlashcardPreviewProps = {
  isLoading: boolean;
  details: DictionaryResponse | null;
};

type Status = "idle" | "saving" | "success" | "error";

type ToastStatus = "success" | "error";

const FlashcardPreview: React.FC<FlashcardPreviewProps> = ({
  isLoading,
  details,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localDetails, setLocalDetails] = useState<DictionaryResponse | null>(
    null
  );
  const [isAnkiConnected, setIsAnkiConnected] = useState<boolean | null>(null);

  const [dbStatus, setDbStatus] = useState<Status>("idle");
  const [ankiStatus, setAnkiStatus] = useState<Status>("idle");
  const [toast, setToast] = useState<ToastStatus | null>(null);

  useEffect(() => {
    if (details) {
      setLocalDetails(details);
    }
    setDbStatus("idle");
    setAnkiStatus("idle");
    setToast(null);
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

    setDbStatus("saving");
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

      setDbStatus("success");
      setToast("success");
    } catch (error) {
      setDbStatus("error");
      setToast("error");
    }
  };

  const handleFlashcardSaveToAnki = async () => {
    if (!isAnkiConnected || !localDetails) return;

    setAnkiStatus("saving");

    const note: AnkiNote = {
      deckName: "Default",
      modelName: "Glossa",
      fields: {
        Word: localDetails?.targetWord,
        Meaning: localDetails?.response.definition,
        Sentence: localDetails?.sentence,
        Reading: localDetails?.response.romanized,
      },
      tags: ["glossa"],
    };
    const { noteId } = await saveNoteToAnki(note);
    if (noteId) {
      setAnkiStatus("success");
      setToast("success");
    } else {
      setAnkiStatus("error");
      setToast("error");
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

  const isDbDisabled = dbStatus === "saving" || dbStatus === "success";
  const isAnkiDisabled = ankiStatus === "saving" || ankiStatus === "success";

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
          {!isDbDisabled && !isAnkiDisabled && (
            <button
              onClick={() => setIsEditing(true)}
              className="absolute top-2 right-2 p-1 text-gray-600 hover:text-black cursor-pointer"
              aria-label="Edit"
            >
              <Pencil size={18} />
            </button>
          )}
          <div>
            <strong>Definition:</strong>{" "}
            <p>{localDetails.response.definition}</p>
            <strong>Romanized:</strong> <p>{localDetails.response.romanized}</p>
            <strong>Language:</strong> <p>{localDetails.response.language}</p>
          </div>
          <button
            onClick={handleFlashcardSaveToDB}
            disabled={dbStatus === "saving" || dbStatus === "success"}
            className={[
              "mt-2 px-3 py-1 rounded text-white",
              isDbDisabled
                ? "bg-blue-500 opacity-50 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 cursor-pointer",
            ].join(" ")}
          >
            {dbStatus === "saving" ? "Saving..." : "Save Flashcard"}
          </button>
          {isAnkiConnected && (
            <button
              onClick={handleFlashcardSaveToAnki}
              className={[
                "mt-2 px-3 py-1 rounded text-white",
                isAnkiDisabled
                  ? "bg-green-500 opacity-50 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600 cursor-pointer",
              ].join(" ")}
              disabled={ankiStatus === "saving" || ankiStatus === "success"}
            >
              {ankiStatus === "saving" ? "Saving..." : "Save to Anki"}
            </button>
          )}
        </>
      )}

      {toast === "success" && (
        <SuccessMessage
          message={"Flashcard saved successfully!"}
          onClose={() => setToast(null)}
          duration={3000}
        />
      )}

      {toast === "error" && (
        <ErrorMessage
          message={"Failed to save flashcard"}
          onClose={() => setToast(null)}
          duration={3000}
        />
      )}
    </div>
  );
};

export default FlashcardPreview;
