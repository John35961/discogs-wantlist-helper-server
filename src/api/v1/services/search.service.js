import searchService from '../../common/services/search.service.js';
import { mapsDiscogsSearchResults } from '../utils/discogs.utils.js';

export default {
  async searchDatabase(accessToken, accessTokenSecret, query, page) {
    let data = await searchService.searchDatabase(accessToken, accessTokenSecret, query, page);
    const pagination = {
      page: data.pagination.page,
      pages: data.pagination.pages,
      per_page: data.pagination.per_page,
      items: data.pagination.items,
    };

    data = {
      pagination: pagination,
      results: mapsDiscogsSearchResults(data.results),
    };

    return data;
  },
};
