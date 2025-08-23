import { Router } from "express";
import { handleCreateUser } from "../controllers/userController";
import { supabaseAuth } from "../middleware/supabaseAuth";

const userRouter = Router();

userRouter.post("/", handleCreateUser);

export default userRouter;