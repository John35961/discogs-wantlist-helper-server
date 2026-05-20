import { Router } from 'express';
import { getRequestToken, getAccessToken, getIdentity } from '../controllers/oauth.controller.js';

const router = Router();

router.get('/request_token', getRequestToken);
router.post('/access_token', getAccessToken);
router.post('/identity', getIdentity);

export default router;
