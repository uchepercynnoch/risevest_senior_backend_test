declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV?: string;
    PORT?: string;
    TEST_PORT?: string;

    SQL_DEV_HOST?: string;
    SQL_DEV_USER?: string;
    SQL_DEV_PASSWORD?: string;
    SQL_DEV_DB?: string;
    SQL_DEV_PORT?: string;

    SQL_TEST_HOST?: string;
    SQL_TEST_USER?: string;
    SQL_TEST_PASSWORD?: string;
    SQL_TEST_DB?: string;
    SQL_TEST_PORT?: string;

    NOSQL_DEV_HOST?: string;
    NOSQL_DEV_PORT?: string;
    NOSQL_DEV_DB?: string;

    NOSQL_TEST_HOST?: string;
    NOSQL_TEST_PORT?: string;
    NOSQL_TEST_DB?: string;

    BEARER_TOKEN?: string;
  }
}
