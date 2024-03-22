import { Pool } from 'pg';
import Redis from 'ioredis';
import envConfig from './env.config';

export const sqlClient = () => {
  try {
    const sqlConfigType = envConfig().sql;

    return new Pool({
      host: sqlConfigType.host,
      user: sqlConfigType.user,
      password: sqlConfigType.password,
      database: sqlConfigType.database,
      port: sqlConfigType.port,
    });
  } catch (e: any) {
    throw new Error(e);
  }
};

export const redisClient = () => {
  try {
    const noSql = envConfig().noSql;

    return new Redis({
      host: noSql.host,
      port: noSql.port,
      db: noSql.database,
    });
  } catch (e: any) {
    throw new Error(e);
  }
};
