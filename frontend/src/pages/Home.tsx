import React, { useMemo, useState } from "react";
import SentenceInput from "../components/SentenceInput";
import ProcessButton from "../components/ProcessButton";
import TokenDisplay from "../components/TokenDisplay";
import ErrorMessage from "../components/ErrorMessage";
import FlashcardPreview from "../components/FlashcardPreview";
import type { Token, DictionaryResponse } from "../models/DictionaryResponse";

export const Home: React.FC = () => {
  const [sentence, setSentence] = useState("");
  const [tokens, setTokens] = useState<Token[]>([]);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [segmentDetails, setSegmentDetails] =
    useState<DictionaryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{
    message: string;
    status?: number;
  } | null>(null);

  // to only allow the segmenter to be created once and not on every render
  // tbh the segmenter isn't very good. maybe check out better libraries
  // also rmb to remove "ja" to support other languages
  const segmenter = useMemo(
    () => new Intl.Segmenter("ja", { granularity: "word" }),
    []
  );

  const handleSegment = () => {
    const segments = segmenter.segment(sentence);
    const segmentArray = Array.from(segments)
      .filter((segment) => segment.isWordLike)
      .map((segment, index) => ({
        segment: segment.segment,
        index,
        isSelected: false,
      }));

    setTokens(segmentArray);
    setSelectedToken(null);
    setSegmentDetails(null);
    setError(null);
  };

  const handleTokenSelect = async (token: Token) => {
    try {
      if (selectedToken?.index === token.index) {
        setSelectedToken(null);
        setSegmentDetails(null);
        return;
      }

      setSelectedToken(token);
      setIsLoading(true);

      const data = await fetchDefinition(sentence, token.segment);

      const fullResponse: DictionaryResponse = {
        sentence: sentence,
        targetWord: token.segment,
        response: data.response,
      };

      setSegmentDetails(fullResponse);
    } catch (err) {
      setError({
        message:
          err instanceof Error ? err.message : "Failed to fetch definition",
        status: err instanceof Response ? err.status : undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDefinition = async (
    sentence: string,
    word: string
  ): Promise<DictionaryResponse> => {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/deepseek/define`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sentence, word }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "API request failed");
    }

    return await response.json();
  };

  return (
    <div className="p-4">
      <SentenceInput value={sentence} onChange={setSentence} />
      <ProcessButton onClick={handleSegment} disabled={!sentence.trim()} />
      {error && <ErrorMessage message={error.message} />}

      {tokens.length > 0 && (
        <>
          <TokenDisplay
            tokens={tokens}
            selected={selectedToken}
            onSelect={handleTokenSelect}
          />
          <FlashcardPreview isLoading={isLoading} details={segmentDetails} />
        </>
      )}
    </div>
  );
};

export default Home;
