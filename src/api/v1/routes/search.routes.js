import { Router } from 'express';
import { searchDatabase } from '../controllers/search.controller.js';
import { authenticated } from '../../../middlewares/authenticated.middleware.js';

const router = Router();

router.post('/search', authenticated, searchDatabase);

export default router;
