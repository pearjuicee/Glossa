import { createClient } from "@supabase/supabase-js";
import { Request, Response, NextFunction } from "express";

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string;
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

declare global {
    namespace Express {
        interface Request {
        supabaseUserId?: string;
        }
    }
}

export const supabaseAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            res.status(401).json({ error: "Access denied. No token provided" });
            return;
        }

        const { data: { user }, error } = await supabaseClient.auth.getUser(token);
        if (error || !user) {
            res.status(401).json({ error: "Invalid token" });
            return;
        }

        req.supabaseUserId = user.id;
        next();
    } catch (err) {
        console.error("Authentication error:", err);
        res.status(500).json({ error: "Internal server error during authentication" });
    }
}