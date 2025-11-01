import { Router } from 'express';
import { verify, refresh } from '../controllers/auth.controller.js';

const router = Router();

router.post('/verify', verify);
router.post('/refresh', refresh);

export default router;
