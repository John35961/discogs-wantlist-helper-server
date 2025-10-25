import { Router } from 'express';
import { searchDatabase } from '../../controllers/search.js';

const router = Router();

router.get('/search', searchDatabase);

export default router;
