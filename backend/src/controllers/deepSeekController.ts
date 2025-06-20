import { Request, Response } from "express";
import { sendToDeepseek } from "../services/deepseekService";

export const handleDefine = async (req: Request, res: Response): Promise<any> => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
    }

    try {
        const response = await sendToDeepseek(prompt);
        return res.status(200).json({ response });
    } catch (error: any) {
        console.error("Error communicating with DeepSeek:", error);
        return res.status(500).json({ error: error?.message || 'Internal Server Error' });
    }
};
