import config from '../config/index.config.js';

export function basicAuth(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader?.startsWith('Basic ')) {
    res.set('WWW-Authenticate', 'Basic realm="Analytics"');
    return res.status(401).send('Unauthorized');
  }

  const [user, password] = Buffer.from(authHeader.slice(6), 'base64')
    .toString()
    .split(':');

  if (user === config.analyticsUser && password === config.analyticsPassword) {
    return next();
  }

  res.set('WWW-Authenticate', 'Basic realm="Analytics"');
  return res.status(401).send('Unauthorized');
}
