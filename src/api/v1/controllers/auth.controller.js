import jwt from 'jsonwebtoken';
import config from '../../../config/index.config.js';
import { ApiError } from '../../../utils/apiError.js';
import oauthService from "../../common/services/oauth.service.js";

const JWT_EXPIRES_IN = '15m';
const REFRESH_EXPIRES_IN = '30d';

export const verify = async (req, res, next) => {
  const { requestToken, requestTokenSecret, oauthVerifier } = req.body;

  if (!requestToken || !requestTokenSecret) return (next(new ApiError(400, 'Request tokens missing')));

  try {
    const { accessToken, accessTokenSecret } = await oauthService.getAccessToken(requestToken, requestTokenSecret, oauthVerifier);
    const identity = await oauthService.getIdentity(accessToken, accessTokenSecret);

    const payload = {
      id: identity.id,
      username: identity.username,
    };
    const jwtToken = jwt.sign(payload, config.jwtGlobalSecret, { expiresIn: JWT_EXPIRES_IN });
    const refreshToken = jwt.sign(payload, config.refreshGlobalSecret, { expiresIn: REFRESH_EXPIRES_IN });

    res.json({
      accessToken: accessToken,
      accessTokenSecret: accessTokenSecret,
      jwtToken: jwtToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    next(new ApiError(401, 'Access tokens invalid'));
  };
};

export const refresh = async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) return (next(new ApiError(400, 'Refresh token missing')));

  try {
    let payload = jwt.verify(refreshToken, config.refreshGlobalSecret);
    payload = {
      id: payload.id,
      username: payload.username,
    };
    const jwtToken = jwt.sign(payload, config.jwtGlobalSecret, { expiresIn: JWT_EXPIRES_IN });

    res.json({ jwtToken });
  } catch (error) {
    next(new ApiError(401, 'Refresh token invalid'));
  }
};
