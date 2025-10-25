import discogsService from "../../services/discogs.service.js";

export const searchDatabase = async (req, res) => {
  const accessToken = req.query.accessToken;
  const accessTokenSecret = req.query.accessTokenSecret;
  const query = req.query.q;

  try {
    const data = await discogsService.searchDatabase(accessToken, accessTokenSecret, query);

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  };
};
