import { Router } from 'express';
import { verify } from '../controllers/v1/auth.controller.js';

const router = Router();

router.post('/verify', verify);

export default router;
