import { Router } from "express";
import { handleDefine } from "../controllers/deepSeekController";
import { supabaseAuth } from "../middleware/supabaseAuth";

const deepseekRouter = Router();

// Protect the /define route with supabaseAuth middleware
deepseekRouter.post("/define", supabaseAuth, handleDefine);

export default deepseekRouter;
