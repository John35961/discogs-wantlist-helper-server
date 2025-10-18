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
};

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
  };

  const text = await res.text();
  const params = new URLSearchParams(text);

  const data = {
    requestToken: params.get('oauth_token'),
    requestTokenSecret: params.get('oauth_token_secret')
  };

  return data;
};

const getAccessToken = async (requestToken, requestTokenSecret, oauthVerifier) => {
  const authHeaders = {
    oauth_consumer_key: config.consumerKey,
    oauth_nonce: oauthNonce(),
    oauth_token: requestToken,
    oauth_signature: `${config.consumerSecret}&${requestTokenSecret}`,
    oauth_signature_method: 'PLAINTEXT',
    oauth_timestamp: oauthTimestamp(),
    oauth_verifier: oauthVerifier,
  };

  const requestData = {
    url: `${config.baseUrl}/oauth/access_token`,
    method: 'POST',
    headers: {
      'Authorization': `OAuth ${headersFrom(authHeaders)}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
  };

  const res = await fetch(requestData.url, {
    method: requestData.method,
    headers: requestData.headers,
  })

  if (!res.ok) {
    throw new Error('Error fetching access token');
  }

  const text = await res.text();
  const params = new URLSearchParams(text)
  const accessToken = params.get('oauth_token');
  const accessTokenSecret = params.get('oauth_token_secret');

  if (!accessToken || !accessTokenSecret) {
    throw new Error('Failed to retrieve access token or access token secret');
  }

  const data = { accessToken, accessTokenSecret };

  return data;
}

export { getUser, getRequestToken, getAccessToken };
