const oauthNonce = () => {
  return Math.random().toString(36).substring(2, 15)
    + Math.random().toString(36).substring(2, 15);
}

const oauthTimestamp = () => {
  return Math.floor(Date.now() / 1000);
}

const headersFrom = (params) => {
  return Object.entries(params).map(([key, value]) => `${key}="${value}"`).join(',');
}

export { oauthNonce, oauthTimestamp, headersFrom };
