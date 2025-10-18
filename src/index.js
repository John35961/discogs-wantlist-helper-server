import config from './config/index.js';
import express from 'express';
import cors from 'cors';
import discogsRouter from './routes/discogs.js';

const app = express();

app.use(cors({
  origin: '*',
}));

app.use(express.json());

app.use('/discogs', discogsRouter);

app.listen(config.port);
