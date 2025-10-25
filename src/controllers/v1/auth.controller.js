import jwt from 'jsonwebtoken';
import config from '../../config/index.config.js';

export const getJwtToken = async (_req, res) => {
  const now = Math.floor(Date.now() / 1000);

  try {
    const payload = {
      iat: now,
      exp: now + 60,
    };
    const token = jwt.sign(payload, config.jwtGlobalSecret);

    res.json({ token });
  } catch {
    res.status(500).json({ error: 'Failed to generate JWT token' });
  };
};
