import oauthService from '../../../api/common/services/oauth.service.js';
import { ApiError } from '../../../utils/apiError.js';

export const getRequestToken = async (req, res, next) => {
  const chromeRuntimeId = req.query.chromeRuntimeId;

  try {
    const data = await oauthService.getRequestToken(chromeRuntimeId);

    res.json(data);
  } catch (error) {
    next(error);
  };
};

export const getAccessToken = async (req, res, next) => {
  const { requestToken, requestTokenSecret, oauthVerifier } = req.body;

  try {
    const data = await oauthService.getAccessToken(requestToken, requestTokenSecret, oauthVerifier);

    res.json(data);
  } catch (error) {
    next(error);
  };
};

export const getIdentity = async (req, res, next) => {
  const accessToken = req.body.accessToken ?? req.query.accessToken;
  const accessTokenSecret = req.body.accessTokenSecret ?? req.query.accessTokenSecret;

  if (req.query.accessToken || req.query.accessTokenSecret) {
    console.warn('[DEPRECATED] GET /oauth/identity: tokens in query params — migrate to POST with tokens in body');
  }

  if (!accessToken || !accessTokenSecret) return (next(new ApiError(400, 'Access tokens missing')));

  try {
    const data = await oauthService.getIdentity(accessToken, accessTokenSecret);

    res.json(data);
  } catch (error) {
    next(error);
  };
};
