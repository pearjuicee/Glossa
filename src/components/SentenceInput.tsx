import React, { useMemo, useState } from 'react'

export const SentenceInput: React.FC = () => {
  const [sentence, setSentence] = useState('');
  const [tokens, setTokens] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number|null>(null);
  const [definition, setDefinition] = useState<string|null>(null);

  // to only allow the segmenter to be created once and not on every render
  // tbh the segmenter isn't very good. maybe check out better libraries
  // also rmb to remove "ja" to support other languages
  const segmenter = useMemo(() => new Intl.Segmenter("ja", { granularity: "word" }), [])

  const handleSegment = () => {
    const segments = segmenter.segment(sentence);
    const segmentArray = Array.from(segments)
      .filter((segment) => segment.isWordLike)
      .map((segment) => segment.segment);

      setTokens(segmentArray);
    console.log(segmentArray.join(" | ")); // for debugging purposes, remove in prod
  }

  const handleSelect = async (index: number) => {
    if (selectedIndex === index) {
      setSelectedIndex(null);
      setDefinition(null);
      return;
    }
    
    setSelectedIndex(index);
    const selectedWord = tokens[index];
    const def = await fetchDefinition(selectedWord);
    setDefinition(def);
  }

  const fetchDefinition = async (word: string) => {
    //temp placeholder for definition fetching logic
    return `Definition for ${word} not implemented yet.`;
    // try {
    //   const response = await fetch(`https://jisho.org/api/v1/search/words?keyword=${word}`);
    //   const data = await response.json();
    //   if (data.length === 0) {
    //     return `No definition found for ${word}`;
    //   }
    //   const first = data.data[0];
    //   const englishDefs = first.senses[0].english_definitions.join(', ');
    //   return `${word}: ${englishDefs}`;
    // } catch (error) {
    //   console.error('Error fetching definition:', error);
    //   return 'Error fetching definition';
    // }
  }

  return (
    <div className='p-4'>
      <textarea
        className="w-full p-2 border border-gray-300 rounded"
        placeholder="Type your sentence here..."
        value={sentence}
        onChange={(e) => setSentence(e.target.value)}
        rows={4}
      />
      <button
        className="mt-2 p-2 bg-blue-500 text-white rounded"
        onClick={handleSegment}
      >
        Process
      </button>

      {tokens.length > 0 && (
        <div>
          {tokens.map((word, index) => (
            <span
              key={index}
              onClick={() => handleSelect(index)}
              className={`cursor-pointer px-2 py-1 border rounded ${
                selectedIndex === index ? 'bg-yellow-300' : 'bg-gray-100'
              }`}
            >
              {word}
            </span>
          ))}
          {definition && (
            <div className="mt-2 p-2 border rounded bg-gray-50">
              <strong>Definition:</strong> {definition}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
