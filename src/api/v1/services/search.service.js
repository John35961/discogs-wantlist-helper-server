import searchService from '../../common/services/search.service.js';
import { mapsDiscogsSearchResults } from '../utils/discogs.utils.js';

export default {
  async searchDatabase(accessToken, accessTokenSecret, query) {
    let data = await searchService.searchDatabase(accessToken, accessTokenSecret, query);

    data = mapsDiscogsSearchResults(data.results);

    return data;
  },
};
