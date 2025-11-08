import searchService from "../services/search.service.js";

export const searchDatabase = async (req, res, next) => {
  const accessToken = req.query.accessToken;
  const accessTokenSecret = req.query.accessTokenSecret;
  const query = req.query.q;
  const page = req.query.page;

  try {
    const data = await searchService.searchDatabase(accessToken, accessTokenSecret, query, page);

    res.json(data);
  } catch (error) {
    next(error);
  };
};
