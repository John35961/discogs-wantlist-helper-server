import { Router } from 'express';
import { getUser, addToWantlist } from '../../controllers/v1/user.controller.js';
import { authenticated } from '../../middlewares/authenticated.middleware.js';

const router = Router();

router.get('/:userName', authenticated, getUser);
router.put('/:userName/wants/:releaseId', authenticated, addToWantlist);

export default router;
