import { Router } from "express";
import { handleDefine } from "../controllers/deepSeekController";

const deepseekRouter = Router();

deepseekRouter.post("/define", handleDefine);

export default deepseekRouter;
