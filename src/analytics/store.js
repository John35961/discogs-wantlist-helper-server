import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(path.join(__dirname, '../../analytics.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp INTEGER NOT NULL,
    method TEXT NOT NULL,
    path TEXT NOT NULL,
    endpoint TEXT NOT NULL,
    status_code INTEGER NOT NULL,
    duration_ms INTEGER NOT NULL,
    search_query TEXT
  )
`);

const insertRequest = db.prepare(`
  INSERT INTO requests (timestamp, method, path, endpoint, status_code, duration_ms, search_query)
  VALUES (@timestamp, @method, @path, @endpoint, @statusCode, @durationMs, @searchQuery)
`);

export function logRequest(data) {
  insertRequest.run(data);
}

export function getStats({ since } = {}) {
  const cutoff = since ?? 0;

  const totalRequests = db.prepare(
    'SELECT COUNT(*) as count FROM requests WHERE timestamp >= ?'
  ).get(cutoff).count;

  const byEndpoint = db.prepare(`
    SELECT endpoint, method, COUNT(*) as count,
           ROUND(AVG(duration_ms)) as avg_ms,
           SUM(CASE WHEN status_code >= 400 THEN 1 ELSE 0 END) as errors
    FROM requests WHERE timestamp >= ?
    GROUP BY endpoint, method
    ORDER BY count DESC
  `).all(cutoff);

  const topSearches = db.prepare(`
    SELECT search_query as query, COUNT(*) as count
    FROM requests
    WHERE search_query IS NOT NULL AND timestamp >= ?
    GROUP BY search_query
    ORDER BY count DESC
    LIMIT 20
  `).all(cutoff);

  const requestsOverTime = db.prepare(`
    SELECT
      (timestamp / 3600000) * 3600000 as hour,
      COUNT(*) as count
    FROM requests WHERE timestamp >= ?
    GROUP BY hour
    ORDER BY hour ASC
  `).all(cutoff);

  const statusCodes = db.prepare(`
    SELECT status_code, COUNT(*) as count
    FROM requests WHERE timestamp >= ?
    GROUP BY status_code
    ORDER BY count DESC
  `).all(cutoff);

  return { totalRequests, byEndpoint, topSearches, requestsOverTime, statusCodes };
}
