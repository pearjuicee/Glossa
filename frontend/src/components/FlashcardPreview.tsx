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

  useEffect(() => {
    if (details) {
      setLocalDetails(details);
    }
  }, [details]);

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
            className="absolute top-2 right-2 p-1 text-gray-600 hover:text-black"
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
        </>
      )}
    </div>
  );
};

export default FlashcardPreview;
