import { logRequest } from './store.js';

function normalizeEndpoint(req) {
  // Replace dynamic segments with placeholders for grouping
  const path = req.path
    .replace(/\/[0-9]+/g, '/:id')
    .replace(/\/r[0-9]+/g, '/:releaseId');

  // Further normalize known patterns
  return path
    .replace(/\/users\/[^/]+\/wants\/[^/]+/, '/users/:userName/wants/:releaseId')
    .replace(/\/users\/[^/]+/, '/users/:userName');
}

export function trackRequests(req, res, next) {
  const start = Date.now();

  res.on('finish', () => {
    const durationMs = Date.now() - start;
    const searchQuery = req.path.includes('/database/search')
      ? (req.query.q ?? null)
      : null;

    logRequest({
      timestamp: start,
      method: req.method,
      path: req.path,
      endpoint: normalizeEndpoint(req),
      statusCode: res.statusCode,
      durationMs,
      searchQuery,
    });
  });

  next();
}
