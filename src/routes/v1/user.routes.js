import { Router } from 'express';
import { getUser, addToWantlist } from '../../controllers/user.controller.js';

const router = Router();

router.get('/:userName', getUser);
router.put('/:userName/wants/:releaseId', addToWantlist);

export default router;
