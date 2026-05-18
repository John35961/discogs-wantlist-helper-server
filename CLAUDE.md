# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start        # Start the Express server (node src/index.js)
```

No build step, no test runner, no linter is configured. The server runs directly with Node.js.

## Architecture

This is a Node.js/Express API server (ES modules, no TypeScript) that acts as a proxy between a Chrome extension and the Discogs API. It handles OAuth 1.0a with Discogs and issues its own JWTs to the extension client.

**Request flow:**
```
Client → Route → Controller → v1 Service (transforms response) → Common Service (HTTP call to Discogs) → Discogs API
```

- `src/api/common/services/` — make the actual `fetch()` calls to Discogs with OAuth 1.0a signing
- `src/api/v1/services/` — map raw Discogs responses to the shape the extension expects
- `src/api/v1/controllers/` — parse the request, call services, return the response
- `src/api/v1/routes/` — wire URLs to controllers; all routes mount under `/discogs/api/v1`

**Auth layering:**
- OAuth 1.0a (via `oauth-1.0a` + `crypto-js`) is used to sign calls to the Discogs API
- JWTs (15-min expiry) are issued to the extension after a successful OAuth flow; refresh tokens last 30 days
- The `authenticated` middleware in `src/middlewares/` verifies JWTs and is applied per-route, not globally

**Error handling:**
- `src/utils/apiError.js` defines the custom `ApiError` class — throw this for all expected errors
- `src/middlewares/errorHandler.middleware.js` catches all errors and formats responses
- `src/middlewares/notFound.middleware.js` handles unmatched routes

## Environment

Config is loaded in `src/config/index.config.js`. Required vars:
- `CONSUMER_KEY` / `CONSUMER_SECRET` — Discogs OAuth app credentials
- `JWT_GLOBAL_SECRET` / `REFRESH_GLOBAL_SECRET` — JWT signing keys
- `DISCOGS_API_BASE_URL` / `DISCOGS_WEBSITE_BASE_URL` / `APP_BASE_URL`
- `PORT` (default 3000)

Deployed on Render.com.
