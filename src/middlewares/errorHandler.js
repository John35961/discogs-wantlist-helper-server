import { ApiError } from '../utils/apiError.js';

export const errorHandler = (err, req, res, _next) => {
  console.error(`[${req.method}] ${req.path} Error: ${err.message}`);

  if (err instanceof ApiError) {
    return res.status(err.status).json({
      message: err.message,
      details: err.details,
    });
  };

  res.status(500).json({ error: 'Internal server error' });
};
