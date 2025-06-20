import OpenAI from "openai";

if (!process.env.DEEPSEEK_API_KEY) {
    throw new Error('Missing DEEPSEEK_API_KEY in environment variables');
}

const deepseekClient = new OpenAI({
    baseURL: 'https://api.deepseek.com/v1',
    apiKey: process.env.DEEPSEEK_API_KEY,
});


export default deepseekClient;