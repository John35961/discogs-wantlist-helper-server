import dotenv from 'dotenv';
dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  discogsApiBaseUrl: process.env.DISCOGS_API_BASE_URL,
  discogsWebsiteBaseUrl: process.env.DISCOGS_WEBSITE_BASE_URL,
  consumerKey: process.env.CONSUMER_KEY,
  consumerSecret: process.env.CONSUMER_SECRET,
};

export default config;
