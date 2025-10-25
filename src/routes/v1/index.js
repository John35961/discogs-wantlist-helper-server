import { Router } from 'express';
import oauthRoutes from './oauth.routes.js';
import userRoutes from './user.routes.js';
import searchRoutes from './search.routes.js';

const router = Router();

router.use('/oauth', oauthRoutes);
router.use('/users', userRoutes);
router.use('/database', searchRoutes);

export default router;
