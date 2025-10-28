import jwt from 'jsonwebtoken';
import config from '../config/index.config.js';

export const authenticated = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Missing authorization header' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Missing token' });

  try {
    jwt.verify(token, config.jwtGlobalSecret);
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  };
};
