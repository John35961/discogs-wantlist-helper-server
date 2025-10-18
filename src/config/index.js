import dotenv from 'dotenv';
dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  baseUrl: process.env.DISCOGS_API_BASE_URL,
  consumerKey: process.env.CONSUMER_KEY,
  consumerSecret: process.env.CONSUMER_SECRET,
  chromeRuntimeId: process.env.CHROME_RUNTIME_ID,
}

export default config;
