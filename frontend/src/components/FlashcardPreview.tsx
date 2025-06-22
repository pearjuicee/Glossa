import type { DictionaryResponse } from "../models/DictionaryResponse";

type FlashcardPreviewProps = {
    isLoading: boolean;
    details: DictionaryResponse | null;
}

const FlashcardPreview: React.FC<FlashcardPreviewProps> = ({ isLoading, details }) => {
    if (isLoading) {
        return (
            <div className="mt-2 p-2 border rounded bg-gray-50 flex items-center space-x-2">
                <div className="animate-spin h-5 w-5 border-t-2 border-blue-500 rounded-full"></div>
                <span>Loading definition...</span>
            </div>
        );
    }

    if (!details) return null;

    return (
        <div className="mt-2 p-2 border rounded bg-gray-50">
            <strong>Definition:</strong> <p>{details.response.definition}</p>
            <strong>Romanized:</strong> <p>{details.response.romanized}</p>
            <strong>Language:</strong> <p>{details.response.language}</p>
        </div>
    );
};

export default FlashcardPreview;