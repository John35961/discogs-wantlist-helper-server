import { Router } from 'express';
import { getRequestToken, getAccessToken, getIdentity } from '../../controllers/oauth.js';

const router = Router();

router.get('/request_token', getRequestToken);
router.post('/access_token', getAccessToken);
router.get('/identity', getIdentity);

export default router;
