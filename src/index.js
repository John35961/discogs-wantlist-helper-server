import config from './config/index.config.js';
import express from 'express';
import cors from 'cors';
import V1DiscogsRouter from './routes/v1/index.js';
import { authenticated } from './middlewares/authenticated.middleware.js';
import { notFound } from './middlewares/notFound.middleware.js';
import { errorHandler } from './middlewares/errorHandler.middleware.js';

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use('/discogs/api/v1', V1DiscogsRouter);
app.use(notFound);
app.use(authenticated);
app.use(errorHandler);

app.listen(config.port);
