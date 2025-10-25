import OAuth from 'oauth-1.0a';
import CryptoJS from 'crypto-js';
import config from '../config/index.config.js';

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

export { oauth };
