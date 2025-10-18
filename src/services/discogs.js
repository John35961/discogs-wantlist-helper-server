import config from '../config/index.js';
import { oauthNonce, oauthTimestamp, headersFrom } from './utils.js';

const getUser = async (userName) => {
  const requestData = {
    url: `${config.baseUrl}/users/${userName}`,
    method: 'GET'
  };

  const res = await fetch(requestData.url, {
    method: requestData.method,
  });

  if (!res.ok) {
    throw new Error('Error fetching user');
  };

  const data = await res.json();

  return data;
}

const getRequestToken = async () => {
  const authHeaders = {
    oauth_consumer_key: config.consumerKey,
    oauth_nonce: oauthNonce(),
    oauth_signature: `${config.consumerSecret}&`,
    oauth_signature_method: 'PLAINTEXT',
    oauth_timestamp: oauthTimestamp(),
    oauth_callback: `https://${config.chromeRuntimeId}.chromiumapp.org/`,
  };

  const requestData = {
    url: `${config.baseUrl}/oauth/request_token`,
    method: 'GET',
    headers: { 'Authorization': `OAuth ${headersFrom(authHeaders)}` },
  };

  const res = await fetch(requestData.url, {
    method: requestData.method,
    headers: requestData.headers,
  });

  if (!res.ok) {
    throw new Error('Error fetching request token');
  }

  const text = await res.text();
  const params = new URLSearchParams(text);

  const data = {
    requestToken: params.get('oauth_token'),
    requestTokenSecret: params.get('oauth_token_secret')
  };

  return data;
}

export { getUser, getRequestToken };
