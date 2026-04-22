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
  // Snapshot before nested routers mutate req.path
  const path = req.path;
  const query = req.query;
  const endpoint = normalizeEndpoint(req);

  res.on('finish', () => {
    logRequest({
      timestamp: start,
      method: req.method,
      path,
      endpoint,
      statusCode: res.statusCode,
      durationMs: Date.now() - start,
      searchQuery: path.includes('/database/search') ? (query.q ?? null) : null,
    });
  });

  next();
}
