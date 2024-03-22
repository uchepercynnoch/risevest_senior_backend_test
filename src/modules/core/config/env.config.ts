import { AppConfig } from '../../../@types/app-config';
import EnvConfigType = AppConfig.EnvConfigType;
import EnvType = AppConfig.EnvType;
import ConfigType = AppConfig.ConfigType;

const config: EnvConfigType = {
  development: {
    sql: {
      host: process.env.SQL_DEV_HOST as string,
      user: process.env.SQL_DEV_USER as string,
      password: process.env.SQL_DEV_PASSWORD as string,
      database: process.env.SQL_DEV_DB as string,
      port: parseInt(process.env.SQL_DEV_PORT as string),
    },
    noSql: {
      host: process.env.NOSQL_DEV_HOST as string,
      port: parseInt(process.env.NOSQL_DEV_PORT as string),
      database: parseInt(process.env.NOSQL_DEV_DB as string),
    },
    service: {
      env: process.env.NODE_ENV as EnvType,
      port: parseInt(process.env.PORT as string),
      apiRoot: '/api/v1',
    },
  },
  test: {
    sql: {
      host: process.env.SQL_TEST_HOST as string,
      user: process.env.SQL_TEST_USER as string,
      password: process.env.SQL_TEST_PASSWORD as string,
      database: process.env.SQL_TEST_DB as string,
      port: parseInt(process.env.SQL_TEST_PORT as string),
    },
    noSql: {
      host: process.env.NOSQL_TEST_HOST as string,
      port: parseInt(process.env.NOSQL_TEST_PORT as string),
      database: parseInt(process.env.NOSQL_TEST_DB as string),
    },
    service: {
      env: process.env.NODE_ENV as EnvType,
      port: parseInt(process.env.TEST_PORT as string),
      apiRoot: '/api-test/v1',
    },
  },
};

export default function envConfig(): ConfigType {
  const env = process.env.NODE_ENV as EnvType;

  return config[env];
}
