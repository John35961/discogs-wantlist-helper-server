import config from '../config/index.config.js';
import oauth from './oauth.utils.js';
import { formatReleasesFrom } from './discogs.utils.js';

export default {
  async searchDatabase(accessToken, accessTokenSecret, query) {
    const requestData = {
      url: `${config.discogsApiBaseUrl}/database/search?q=${query}&per_page=5&type=release`,
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

    if (!res.ok) {
      throw new Error('Error searching for releases');
    };

    let data = await res.json();

    if (data.results.length === 0) {
      throw new Error('No release found');
    };

    data = formatReleasesFrom(data);

    return data;
  },
}
