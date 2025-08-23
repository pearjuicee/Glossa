import { Request, Response } from "express";
import { findOrCreateUser } from "../services/userService";

export const handleCreateUser = async (req: Request, res: Response) => {
  try {
    const supabase_uid = req.supabaseUserId;

    if (!supabase_uid) {
      res.status(400).json({ error: "Supabase Uuid is required" });
      return;
    }

    const user = await findOrCreateUser(supabase_uid);

    res.status(200).json({
        message: 'User profile processed successfully.',
        user: {
          user_id: user.user_id,
          supabase_uid: user.supabase_uid
        }
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "An internal server error occurred while processing your profile." });
  }
};