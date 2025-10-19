import config from '../config/index.js';
import { oauth } from './oauth.js';

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

const getRequestToken = async (chromeRuntimeId) => {
  const requestData = {
    url: `${config.baseUrl}/oauth/request_token`,
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
};

const getAccessToken = async (requestToken, requestTokenSecret, oauthVerifier) => {
  const requestData = {
    url: `${config.baseUrl}/oauth/access_token`,
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
  });

  if (!res.ok) {
    throw new Error('Error fetching identity');
  };

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
