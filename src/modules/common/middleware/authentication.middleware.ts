import { NextFunction, Request, Response } from 'express';
import { ResponseDto } from '../dto';

const MESSAGE = 'Unauthorized';
const TOKEN = process.env.BEARER_TOKEN as string;

export default function authenticationMiddleware(req: Request, res: Response, next: NextFunction) {
  const authorization = req.header('Authorization');

  if (!authorization) return res.status(401).json(new ResponseDto(401, MESSAGE, req.originalUrl));

  const [bearer, token] = authorization.split(' ');

  if (bearer !== 'Bearer') return res.status(401).json(new ResponseDto(401, MESSAGE, req.originalUrl));
  if (token.trim() !== TOKEN) return res.status(401).json(new ResponseDto(401, MESSAGE, req.originalUrl));

  next();
}
