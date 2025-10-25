import discogsService from "../../services/discogs.service.js";

export const getUser = async (req, res) => {
  const userName = req.params.userName;

  try {
    const data = await discogsService.getUser(userName);

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  };
};

export const addToWantlist = async (req, res) => {
  const userName = req.params.userName;
  const releaseId = req.params.releaseId;
  const { accessToken, accessTokenSecret } = req.body;

  if (!accessToken || !accessTokenSecret) {
    return res.status(400).json({ error: 'Missing access tokens' });
  };

  try {
    const data = await discogsService.addToWantlist(accessToken, accessTokenSecret, userName, releaseId);

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  };
};
