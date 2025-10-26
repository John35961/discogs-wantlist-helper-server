import jwt from 'jsonwebtoken';
import config from '../../config/index.config.js';
import { ApiError } from '../../utils/apiError.js';
import oauthService from "../../services/oauth.service.js";

export const verify = async (req, res, next) => {
  const { accessToken, accessTokenSecret } = req.body;

  if (!accessToken || !accessTokenSecret) return (next(new ApiError(400, 'Access tokens missing')));

  try {
    const identity = await oauthService.getIdentity(accessToken, accessTokenSecret);

    const payload = {
      id: identity.id,
      username: identity.username,
    };
    const jwtToken = jwt.sign(payload, config.jwtGlobalSecret, { expiresIn: '6h' });

    res.json({ token: jwtToken });
  } catch (error) {
    next(new ApiError(401, 'Access tokens invalid'));
  };
};
