import discogsUserService from "../../services/user.service.js";

export const getUser = async (req, res, next) => {
  const userName = req.params.userName;

  try {
    const data = await discogsUserService.getUser(userName);

    res.json(data);
  } catch (error) {
    next(error);
  };
};

export const addToWantlist = async (req, res, next) => {
  const userName = req.params.userName;
  const releaseId = req.params.releaseId;
  const { accessToken, accessTokenSecret } = req.body;

  if (!accessToken || !accessTokenSecret) {
    return res.status(400).json({ error: 'Missing access tokens' });
  };

  try {
    const data = await discogsUserService.addToWantlist(accessToken, accessTokenSecret, userName, releaseId);

    res.json(data);
  } catch (error) {
    next(error);
  };
};
