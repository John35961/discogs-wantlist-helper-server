import config from '../../../config/index.config.js';
import oauth from '../utils/oauth.utils.js';
import { ApiError } from '../../../utils/apiError.js';

const MAX_ADDED_SINCE_IN_SECONDS = 3;

export default {
  async getUser(userName) {
    const requestData = {
      url: `${config.discogsApiBaseUrl}/users/${userName}`,
      method: 'GET'
    };

    const res = await fetch(requestData.url, {
      method: requestData.method,
    });

    if (!res.ok) throw new ApiError(res.status, 'Error fetching user');

    const data = await res.json();

    return data;
  },

  async addToWantlist(accessToken, accessTokenSecret, userName, releaseId) {
    const requestData = {
      url: `${config.discogsApiBaseUrl}/users/${userName}/wants/${releaseId}`,
      method: 'PUT'
    };

    const tokens = {
      key: accessToken,
      secret: accessTokenSecret
    };

    const headers = oauth.instance.toHeader(oauth.instance.authorize(requestData, tokens));

    const res = await fetch(requestData.url, {
      method: requestData.method,
      headers: headers,
      credentials: 'omit',
    });

    if (!res.ok) throw new ApiError(res.status, 'Error adding to wantlist');

    const data = await res.json();

    const dateAdded = new Date(data.date_added);
    const addedSince = (Date.now() - dateAdded.getTime()) / 1000;

    if (addedSince > MAX_ADDED_SINCE_IN_SECONDS) throw new ApiError(422, 'Already in wantlist');

    return data.basic_information;
  },
};
