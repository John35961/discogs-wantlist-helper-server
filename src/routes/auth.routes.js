import { Router } from 'express';
import { getJwtToken } from '../controllers/v1/auth.controller.js';

const router = Router();

router.get('/jwt_token', getJwtToken);

export default router;
