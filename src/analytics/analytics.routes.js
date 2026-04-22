import { Router } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { basicAuth } from './basicAuth.middleware.js';
import { getStats } from './store.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = Router();

router.use(basicAuth);

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/analytics/index.html'));
});

router.get('/data', (req, res) => {
  const days = parseInt(req.query.days ?? '7', 10);
  const since = Date.now() - days * 24 * 60 * 60 * 1000;
  res.json(getStats({ since }));
});

export default router;
