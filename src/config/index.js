import dotenv from 'dotenv';
dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  baseUrl: process.env.DISCOGS_API_BASE_URL,
}

export default config;
