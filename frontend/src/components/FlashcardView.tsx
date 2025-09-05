import React from "react";
import type { Flashcard } from "../models/Flashcard";

type FlashcardViewProps = {
  flashcard: Flashcard;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
};

const FlashcardView: React.FC<FlashcardViewProps> = ({
  flashcard,
  onEdit,
  onDelete,
  className = "",
}) => {
  const {
      definition,
      romanized,
      language,
      sentence,
      targetWord,
      addedToAnki,
  } = flashcard;
  return (
    <div className={`rounded-xl border bg-white shadow-sm p-4 flex flex-col ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          {targetWord ? (
            <h3 className="text-base font-semibold truncate">{targetWord}</h3>
          ) : (
            <h3 className="text-base font-semibold text-gray-700">Flashcard</h3>
          )}
          {sentence && (
            <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">{sentence}</p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {language && (
            <span className="text-xs px-2 py-0.5 rounded-full border bg-gray-50">
              {language}
            </span>
          )}
          {addedToAnki && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
              In Anki
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="mt-3 space-y-2">
        <div>
          <div className="text-xs font-medium text-gray-500">Definition</div>
          <div className="text-sm">{definition}</div>
        </div>

        {romanized && (
          <div>
            <div className="text-xs font-medium text-gray-500">Romanized</div>
            <div className="text-sm text-gray-800">{romanized}</div>
          </div>
        )}
      </div>

      {/* Footer actions */}
      {(onEdit || onDelete) && (
        <div className="mt-3 flex justify-end gap-2">
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="px-3 py-1.5 text-xs rounded-lg border hover:bg-gray-50"
            >
              Delete
            </button>
          )}
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="px-3 py-1.5 text-xs rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Edit
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FlashcardView;
