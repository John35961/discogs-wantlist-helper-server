import jwt from 'jsonwebtoken';
import config from '../config/index.config.js';

export const authenticated = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Missing authorization header' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    jwt.verify(token, config.jwtGlobalSecret);
    next();
  } catch (error) {
    return res.status(403).json({ erorr: 'Invalid or expired token' });
  };
};
