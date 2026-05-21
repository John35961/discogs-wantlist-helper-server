import { validateSession, parseCookies } from './session.store.js';

export function sessionAuth(req, res, next) {
  const cookies = parseCookies(req);
  if (validateSession(cookies.analytics_session)) return next();

  // API requests get 401, page requests get a redirect
  const acceptsHtml = req.headers.accept?.includes('text/html');
  if (acceptsHtml) return res.redirect('/analytics/login');
  return res.status(401).json({ message: 'Unauthorized' });
}
