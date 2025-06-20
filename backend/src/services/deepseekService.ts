import deepseekClient from "../utils/apiClient";

interface DictionaryResponse {
    definition: string;
    romanized: string;
    language?: string;
}

const system_prompt = ` The user will provide a sentence and a word from that sentence.
        Your task is to provide a clear and short definition of the word in that context, its romanized form (if applicable), and the language of the word.

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
          "definition": "student",
          "romanized": "gakusei",
          "language": "Japanese"
        }
        `

export const sendToDeepseek = async (prompt: string) => {
    const completion = await deepseekClient.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: system_prompt },
        { role: 'user', content: prompt },
      ],
      temperature: 0.2,
      max_completion_tokens: 30,
      response_format: {
        type: 'json_object'
      }
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
        throw new Error("No content in response");
    }

    try {
        return JSON.parse(content);
    } catch (error) {
        throw new Error("Invalid JSON response");
    }
};