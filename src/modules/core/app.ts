import express from 'express';
import morgan from 'morgan';
import cors, { CorsOptions } from 'cors';
import envConfig from './config/env.config';
import userController from '../user/user.controller';
import errorAsyncMiddleware from '../common/middleware/error-async.middleware';
import postController from '../post/post.controller';
import authenticationMiddleware from '../common/middleware/authentication.middleware';

const app = express();
const config = envConfig();

const corsOptions: CorsOptions = {
  origin: [],
  credentials: true,
};

app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(express.json());

app.use(`${config.service.apiRoot}/users`, authenticationMiddleware, userController(express.Router()));
app.use(`${config.service.apiRoot}/posts`, authenticationMiddleware, postController(express.Router()));
app.use(errorAsyncMiddleware);

export default app;
