import config from '../config/index.config.js';
import oauth from './oauth.utils.js';

export default {
  async getRequestToken(chromeRuntimeId) {
    const requestData = {
      url: `${config.discogsApiBaseUrl}/oauth/request_token`,
      method: 'GET',
      data: { oauth_callback: `https://${chromeRuntimeId}.chromiumapp.org/` }
    };

    const headers = oauth.instance.toHeader(oauth.instance.authorize(requestData));

    const res = await fetch(requestData.url, {
      method: requestData.method,
      headers: headers,
    });

    if (!res.ok) throw new ApiError(res.status, 'Error fetching request token', data);

    const text = await res.text();
    const params = new URLSearchParams(text);
    const requestToken = params.get('oauth_token');
    const requestTokenSecret = params.get('oauth_token_secret');

    if (!requestToken || !requestTokenSecret) throw new ApiError(res.status, 'Request tokens missing', data);

    return { requestToken, requestTokenSecret };
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

    const headers = oauth.instance.toHeader(oauth.instance.authorize(requestData, tokens));

    const res = await fetch(requestData.url, {
      method: requestData.method,
      headers: headers,
    });

    if (!res.ok) throw new ApiError(res.status, 'Error fetching access tokens', data);

    const text = await res.text();
    const params = new URLSearchParams(text)
    const accessToken = params.get('oauth_token');
    const accessTokenSecret = params.get('oauth_token_secret');

    if (!accessToken || !accessTokenSecret) throw new ApiError(res.status, 'Access tokens missing', data);

    return { accessToken, accessTokenSecret };
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

    const headers = oauth.instance.toHeader(oauth.instance.authorize(requestData, tokens));

    const res = await fetch(requestData.url, {
      method: requestData.method,
      headers: headers
    });

    if (!res.ok) throw new new ApiError(res.status, 'Error fetching identity', data);

    const data = await res.json();

    return data;
  },
}
