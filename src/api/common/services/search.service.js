import config from '../../../config/index.config.js';
import oauth from '../utils/oauth.utils.js';
import { ApiError } from '../../../utils/apiError.js';

export default {
  async searchDatabase(accessToken, accessTokenSecret, query, page) {
    const requestData = {
      url: `${config.discogsApiBaseUrl}/database/search?q=${query}&page=${page}&per_page=5&type=release`,
      method: 'GET'
    };

    const tokens = {
      key: accessToken,
      secret: accessTokenSecret
    };

    const headers = oauth.instance.toHeader(oauth.instance.authorize(requestData, tokens));

    const res = await fetch(requestData.url, {
      method: 'GET',
      headers: headers,
    });

    if (!res.ok) throw new ApiError(res.status, 'Error fetching releases');

    let data = await res.json();

    if (data.results.length === 0) throw new ApiError(404, 'No release found');

    return data;
  },
};
