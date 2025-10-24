import express from 'express';
import { getRequestToken, getAccessToken, getIdentity } from '../controllers/oauth.js';
import { getUser, addToWantlist } from '../controllers/user.js';
import { searchDatabase } from '../controllers/search.js';

const router = express.Router();

router.get('/oauth/request_token', getRequestToken);
router.post('/oauth/access_token', getAccessToken);
router.get('/oauth/identity', getIdentity);
router.get('/users/:userName', getUser);
router.put('/users/:userName/wants/:releaseId', addToWantlist);
router.get('/database/search', searchDatabase);

export default router;
