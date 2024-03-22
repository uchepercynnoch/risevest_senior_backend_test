import { NextFunction, Request, Response } from 'express';

export declare namespace AppConfig {
  type EnvType = 'development' | 'test';
  type SqlConfigType = {
    host: string;
    user: string;
    password: string;
    database: string;
    port: number;
  };
  type NoSqlConfigType = Pick<SqlConfigType, 'host' | 'port'> & {
    database: number;
  };
  type ServiceType = {
    port: number;
    env: EnvType;
    apiRoot: string;
  };
  type ConfigType = {
    sql: SqlConfigType;
    noSql: NoSqlConfigType;
    service: ServiceType;
  };
  type EnvConfigType = Record<EnvType, ConfigType>;
  type RouteHandlerType = (req: Request, res: Response, next: NextFunction) => Promise<void> | void;
}
