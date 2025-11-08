import commonUserService from "../../common/services/user.service.js";
import userService from "../services/user.service.js";
import { ApiError } from '../../../utils/apiError.js';

export const getUser = async (req, res, next) => {
  const userName = req.params.userName;

  try {
    const data = await userService.getUser(userName);

    res.json(data);
  } catch (error) {
    next(error);
  };
};

export const addToWantlist = async (req, res, next) => {
  const userName = req.params.userName;
  const releaseId = req.params.releaseId;
  const { accessToken, accessTokenSecret } = req.body;

  if (!accessToken || !accessTokenSecret) return (next(new ApiError(400, 'Access tokens missing')));

  try {
    const data = await userService.addToWantlist(accessToken, accessTokenSecret, userName, releaseId);

    res.json(data);
  } catch (error) {
    next(error);
  };
};

export const removeFromWantlist = async (req, res, next) => {
  const userName = req.params.userName;
  const releaseId = req.params.releaseId;
  const { accessToken, accessTokenSecret } = req.body;

  if (!accessToken || !accessTokenSecret) return (next(new ApiError(400, 'Access tokens missing')));

  try {
    await commonUserService.removeFromWantlist(accessToken, accessTokenSecret, userName, releaseId);

    res.sendStatus(204);
  } catch (error) {
    next(error);
  };
};
