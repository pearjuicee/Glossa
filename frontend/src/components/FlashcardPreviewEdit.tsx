import { useState } from "react";
import type { DictionaryResponse } from "../models/DictionaryResponse";

type FlashcardPreviewEditProps = {
  initialDetails: DictionaryResponse;
  onSave: (updated: DictionaryResponse) => void;
  onCancel: () => void;
};

const FlashcardPreviewEdit: React.FC<FlashcardPreviewEditProps> = ({
  initialDetails,
  onSave,
  onCancel,
}) => {
  const [editedDetails, setEditedDetails] =
    useState<DictionaryResponse>(initialDetails);

  const handleFieldChange = (
    field: keyof DictionaryResponse["response"],
    value: string
  ) => {
    setEditedDetails((prev) => ({
      ...prev,
      response: {
        ...prev.response,
        [field]: value,
      },
    }));
  };

  return (
    <div className="mt-2 p-4 border rounded bg-yellow-50">
      <div className="mb-2">
        <label className="font-semibold">Definition:</label>
        <textarea
          value={editedDetails.response.definition}
          onChange={(e) => handleFieldChange("definition", e.target.value)}
          className="w-full border px-2 py-1 mt-1 rounded"
        />
      </div>

      <div className="mb-2">
        <label className="font-semibold">Romanized:</label>
        <textarea
          value={editedDetails.response.romanized}
          onChange={(e) => handleFieldChange("romanized", e.target.value)}
          className="w-full border px-2 py-1 mt-1 rounded"
        />
      </div>

      <div className="mb-2">
        <label className="font-semibold">Language:</label>
        <textarea
          value={editedDetails.response.language}
          onChange={(e) => handleFieldChange("language", e.target.value)}
          className="w-full border px-2 py-1 mt-1 rounded"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(editedDetails)}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default FlashcardPreviewEdit;
