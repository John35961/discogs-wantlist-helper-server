import { Router } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { sessionAuth } from './sessionAuth.middleware.js';
import { createSession, destroySession, parseCookies } from './session.store.js';
import { getStats } from './store.js';
import config from '../config/index.config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = Router();

const COOKIE_OPTS = 'HttpOnly; SameSite=Strict; Path=/analytics';

router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/analytics/login.html'));
});

router.post('/login', (req, res) => {
  const { username, password } = req.body ?? {};
  if (username === config.analyticsUser && password === config.analyticsPassword) {
    const token = createSession();
    res.setHeader('Set-Cookie', `analytics_session=${token}; ${COOKIE_OPTS}`);
    return res.json({ ok: true });
  }
  return res.status(401).json({ message: 'Invalid credentials' });
});

router.post('/logout', (req, res) => {
  const cookies = parseCookies(req);
  destroySession(cookies.analytics_session);
  res.setHeader('Set-Cookie', `analytics_session=; ${COOKIE_OPTS}; Max-Age=0`);
  res.json({ ok: true });
});

// All routes below require a valid session
router.use(sessionAuth);

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/analytics/index.html'));
});

router.get('/data', (req, res) => {
  const days = parseInt(req.query.days ?? '7', 10);
  const since = Date.now() - days * 24 * 60 * 60 * 1000;
  res.json(getStats({ since }));
});

export default router;
