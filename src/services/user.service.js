import config from '../config/index.config.js';
import oauth from './oauth.utils.js';
import { formatUserFrom, formatReleaseFrom } from './discogs.utils.js';
import { ApiError } from '../utils/apiError.js';

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

    let data = await res.json();

    if (!res.ok) throw new ApiError(res.status, 'Error fetching user', data);

    data = formatUserFrom(data);

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

    let data = await res.json();

    if (!res.ok) throw new ApiError(res.status, 'Error adding to wantlist', data);

    const dateAdded = new Date(data.date_added);
    const addedSince = (Date.now() - dateAdded.getTime()) / 1000;

    if (addedSince > MAX_ADDED_SINCE_IN_SECONDS) {
      throw new ApiError(422, 'Already in wantlist', data);
    };

    data = formatReleaseFrom(data);

    return data;
  },
};
