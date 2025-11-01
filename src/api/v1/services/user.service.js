import config from '../../../config/index.config.js';
import oauth from '../utils/oauth.utils.js';
import { mapDiscogsUser, mapDiscogsReleaseDetails } from '../utils/discogs.utils.js';
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

    let data = await res.json();

    data = mapDiscogsUser(data);

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

    let data = await res.json();

    const dateAdded = new Date(data.date_added);
    const addedSince = (Date.now() - dateAdded.getTime()) / 1000;

    if (addedSince > MAX_ADDED_SINCE_IN_SECONDS) throw new ApiError(422, 'Already in wantlist');

    data = mapDiscogsReleaseDetails(data.basic_information);

    return data;
  },
};
