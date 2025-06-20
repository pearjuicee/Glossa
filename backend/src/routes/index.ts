import { Router } from 'express';
import deepseekRoutes from './deepseekRoute';

const router = Router();

router.use('/deepseek', deepseekRoutes);

export default router;
