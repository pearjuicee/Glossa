import deepseekClient from "../utils/apiClient";

interface DictionaryResponse {
    definition: string;
    romanized: string;
    language?: string;
}

const system_prompt = ` The user will provide a sentence and a word from that sentence.
        Your task is to provide a clear definition of the word in that context in a few words, its romanized form (if applicable), and the language of the word.
        For the romanization, Use Hepburn romanization for Japanese, Revised Romanization for Korean, and Pinyin with correct intonation for Chinese

        ALWAYS respond in this EXACT JSON format:
        {
          "definition": "clear_definition_here",
          "romanized": "hepburn_romanization_here",
          "language": "source_language_if_relevant"
        }
        
        EXAMPLE INPUT:
        Sentence: "私は学生です。" Word: "学生"

        EXAMPLE OUTPUT:
        {
          "definition": "a student",
          "romanized": "gakusei",
          "language": "Japanese"
        }
        `

export const sendToDeepseek = async (sentence: string, word: string): Promise<DictionaryResponse> => {
    const userPrompt = `Sentence: "${sentence}" Word: "${word}"`;

    const completion = await deepseekClient.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: system_prompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      max_completion_tokens: 150,
      response_format: {
        type: 'json_object'
      }
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error("No content in response");

    try {
        return JSON.parse(content) as DictionaryResponse;
    } catch (error) {
      console.error("Error parsing JSON response:", error); // Log the error for debugging
        throw new Error("Invalid JSON response");
    }
};