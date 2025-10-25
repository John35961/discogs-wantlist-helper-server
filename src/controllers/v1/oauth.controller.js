import oauthService from "../../services/oauth.service.js";

export const getRequestToken = async (req, res, next) => {
  const chromeRuntimeId = req.query.chromeRuntimeId;

  try {
    const data = await oauthService.getRequestToken(chromeRuntimeId);

    res.json(data);
  } catch (error) {
    next();
  };
};

export const getAccessToken = async (req, res, next) => {
  const { requestToken, requestTokenSecret, oauthVerifier } = req.body;

  try {
    const data = await oauthService.getAccessToken(requestToken, requestTokenSecret, oauthVerifier);

    res.json(data);
  } catch (error) {
    next();
  };
};

export const getIdentity = async (req, res, next) => {
  const accessToken = req.query.accessToken;
  const accessTokenSecret = req.query.accessTokenSecret;

  if (!accessToken || !accessTokenSecret) {
    return res.status(400).json({ error: 'Missing access tokens' });
  };

  try {
    const data = await oauthService.getIdentity(accessToken, accessTokenSecret);

    res.json(data);
  } catch (error) {
    next();
  };
};
