import { Router } from 'express';
import { searchDatabase } from '../../controllers/v1/search.controller.js';
import { authenticated } from '../../middlewares/authenticated.middleware.js';

const router = Router();

router.get('/search', authenticated, searchDatabase);

export default router;
