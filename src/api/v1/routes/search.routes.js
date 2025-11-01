import { Router } from 'express';
import { searchDatabase } from '../controllers/search.controller.js';
import { authenticated } from '../../../middlewares/authenticated.middleware.js';

const router = Router();

router.get('/search', authenticated, searchDatabase);

export default router;
