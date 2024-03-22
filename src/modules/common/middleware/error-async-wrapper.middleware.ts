import { NextFunction, Request, Response } from 'express';
import { AppConfig } from '../../../@types/app-config';
import RouteHandler = AppConfig.RouteHandlerType;

export default function errorAsyncWrapperMiddleware(handler: RouteHandler) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (e: any) {
      next(e);
    }
  };
}
