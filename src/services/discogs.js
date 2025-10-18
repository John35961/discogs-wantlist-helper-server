import OAuth from 'oauth-1.0a';
import CryptoJS from 'crypto-js';
import config from '../config/index.js';
import { oauthNonce, oauthTimestamp, headersFrom } from './utils.js';

const oauth = OAuth({
  consumer: {
    key: config.consumerKey,
    secret: config.consumerSecret,
  },
  signature_method: 'HMAC-SHA1',
  hash_function(base_string, key) {
    return CryptoJS.HmacSHA1(base_string, key).toString(CryptoJS.enc.Base64);
  }
});

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
  const requestData = {
    url: `${config.baseUrl}/oauth/request_token`,
    method: 'GET'
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
};

const getIdentity = async (accessToken, accessTokenSecret) => {
  const requestData = {
    url: `${config.baseUrl}/oauth/identity`,
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
  })

  if (!res.ok) {
    throw new Error('Error fetching identity');
  }

  const data = await res.json();

  return data;
};

const addToWantlist = async (accessToken, accessTokenSecret, userName, releaseId) => {
  const requestData = {
    url: `https://api.discogs.com/users/${userName}/wants/${releaseId}`,
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

  const data = await res.json();

  return data;
};

export { getUser, getRequestToken, getAccessToken, getIdentity, addToWantlist };
