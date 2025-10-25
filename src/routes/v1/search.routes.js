import { Router } from 'express';
import { searchDatabase } from '../../controllers/v1/search.controller.js';

const router = Router();

router.get('/search', searchDatabase);

export default router;
