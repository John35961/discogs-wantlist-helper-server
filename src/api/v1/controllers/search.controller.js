import searchService from "../services/search.service.js";

export const searchDatabase = async (req, res, next) => {
  const accessToken = req.body.accessToken ?? req.query.accessToken;
  const accessTokenSecret = req.body.accessTokenSecret ?? req.query.accessTokenSecret;
  const query = req.query.q;
  const page = req.query.page;

  if (req.query.accessToken || req.query.accessTokenSecret) {
    console.warn('[DEPRECATED] GET /database/search: tokens in query params — migrate to POST with tokens in body');
  }

  try {
    const data = await searchService.searchDatabase(accessToken, accessTokenSecret, query, page);

    res.json(data);
  } catch (error) {
    next(error);
  };
};
