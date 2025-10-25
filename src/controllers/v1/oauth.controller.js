import discogsService from "../../services/discogs.service.js";

export const getRequestToken = async (req, res) => {
  const chromeRuntimeId = req.query.chromeRuntimeId;

  try {
    const data = await discogsService.getRequestToken(chromeRuntimeId);

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  };
};

export const getAccessToken = async (req, res) => {
  const { requestToken, requestTokenSecret, oauthVerifier } = req.body;

  try {
    const data = await discogsService.getAccessToken(requestToken, requestTokenSecret, oauthVerifier);

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  };
};

export const getIdentity = async (req, res) => {
  const accessToken = req.query.accessToken;
  const accessTokenSecret = req.query.accessTokenSecret;

  if (!accessToken || !accessTokenSecret) {
    return res.status(400).json({ error: 'Missing access tokens' });
  };

  try {
    const data = await discogsService.getIdentity(accessToken, accessTokenSecret);

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  };
};
