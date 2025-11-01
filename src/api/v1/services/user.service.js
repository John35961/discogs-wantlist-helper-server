import userService from '../../common/services/user.service.js';
import { mapDiscogsUser, mapDiscogsReleaseDetails } from '../utils/discogs.utils.js';

export default {
  async getUser(userName) {
    let data = await userService.getUser(userName);

    data = mapDiscogsUser(data);

    return data;
  },

  async addToWantlist(accessToken, accessTokenSecret, userName, releaseId) {
    let data = await userService.addToWantlist(accessToken, accessTokenSecret, userName, releaseId);

    data = mapDiscogsReleaseDetails(data);

    return data;
  },
};
