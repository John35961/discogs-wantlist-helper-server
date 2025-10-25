import { Router } from 'express';
import oauthRoutes from './oauth.js';
import userRoutes from './user.js';
import searchRoutes from './search.js';

const router = Router();

router.use('/oauth', oauthRoutes);
router.use('/users', userRoutes);
router.use('/database', searchRoutes);

export default router;
