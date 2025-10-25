import config from '../config/index.config.js';
import { formatUserFrom, formatReleaseFrom, formatReleasesFrom } from './utils.service.js';
import { oauth } from './oauth.service.js';

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

    if (!res.ok) {
      throw new Error('Error fetching user');
    };

    let data = await res.json();

    data = formatUserFrom(data);

    return data;
  },

  async getRequestToken(chromeRuntimeId) {
    const requestData = {
      url: `${config.discogsApiBaseUrl}/oauth/request_token`,
      method: 'GET',
      data: { oauth_callback: `https://${chromeRuntimeId}.chromiumapp.org/` }
    };

    const headers = oauth.toHeader(oauth.authorize(requestData));

    const res = await fetch(requestData.url, {
      method: requestData.method,
      headers: headers,
    });

    if (!res.ok) {
      throw new Error('Error fetching request token');
    };

    const text = await res.text();
    const params = new URLSearchParams(text);

    const data = {
      requestToken: params.get('oauth_token'),
      requestTokenSecret: params.get('oauth_token_secret')
    };

    return data;
  },

  async getAccessToken(requestToken, requestTokenSecret, oauthVerifier) {
    const requestData = {
      url: `${config.discogsApiBaseUrl}/oauth/access_token`,
      method: 'POST',
      data: { oauth_verifier: oauthVerifier },
    };

    const tokens = {
      key: requestToken,
      secret: requestTokenSecret
    };

    const headers = oauth.toHeader(oauth.authorize(requestData, tokens));

    const res = await fetch(requestData.url, {
      method: requestData.method,
      headers: headers,
    });

    if (!res.ok) {
      throw new Error('Error fetching access token');
    };

    const text = await res.text();
    const params = new URLSearchParams(text)
    const accessToken = params.get('oauth_token');
    const accessTokenSecret = params.get('oauth_token_secret');

    if (!accessToken || !accessTokenSecret) {
      throw new Error('Failed to retrieve access token or access token secret');
    };

    const data = { accessToken, accessTokenSecret };

    return data;
  },

  async getIdentity(accessToken, accessTokenSecret) {
    const requestData = {
      url: `${config.discogsApiBaseUrl}/oauth/identity`,
      method: 'GET'
    };

    const tokens = {
      key: accessToken,
      secret: accessTokenSecret
    };

    const headers = oauth.toHeader(oauth.authorize(requestData, tokens));

    const res = await fetch(requestData.url, {
      method: requestData.method,
      headers: headers
    });

    if (!res.ok) {
      throw new Error('Error fetching identity');
    };

    const data = await res.json();

    return data;
  },

  async searchDatabase(accessToken, accessTokenSecret, query) {
    const requestData = {
      url: `${config.discogsApiBaseUrl}/database/search?q=${query}&per_page=5&type=release`,
      method: 'GET'
    };

    const tokens = {
      key: accessToken,
      secret: accessTokenSecret
    };

    const headers = oauth.toHeader(oauth.authorize(requestData, tokens));

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

  async addToWantlist(accessToken, accessTokenSecret, userName, releaseId) {
    const requestData = {
      url: `${config.discogsApiBaseUrl}/users/${userName}/wants/${releaseId}`,
      method: 'PUT'
    };

    const tokens = {
      key: accessToken,
      secret: accessTokenSecret
    };

    const headers = oauth.toHeader(oauth.authorize(requestData, tokens));

    const res = await fetch(requestData.url, {
      method: requestData.method,
      headers: headers,
      credentials: 'omit',
    });

    if (!res.ok) {
      throw new Error('Error adding to wantlist');
    };

    let data = await res.json();

    const dateAdded = new Date(data.date_added);
    const addedSince = (Date.now() - dateAdded.getTime()) / 1000;

    if (addedSince > MAX_ADDED_SINCE_IN_SECONDS) {
      throw new Error('Already in wantlist');
    };

    data = formatReleaseFrom(data);

    return data;
  },
}
