import { NextFunction, Request, Response } from 'express';
import { ResponseDto } from '../dto';
import AppLogger from '../app.logger';
import * as util from 'util';
import envConfig from '../../core/config/env.config';

export default async function errorAsyncMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {
  const logger = AppLogger.init(errorAsyncMiddleware.name).logger;

  if (envConfig().service.env !== 'test') logger.error(util.inspect(err));

  res.status(400).json(new ResponseDto(400, err?.message ?? 'Please contact administrator', req.originalUrl));

  next();
}
