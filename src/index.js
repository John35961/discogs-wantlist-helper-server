import config from './config/index.config.js';
import express from 'express';
import cors from 'cors';
import V1DiscogsRouter from './routes/v1/index.js';

const app = express();

app.use(cors({
  origin: '*',
}));

app.use(express.json());

app.use('/discogs/api/v1', V1DiscogsRouter);

app.listen(config.port);
