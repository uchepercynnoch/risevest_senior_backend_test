import 'dotenv/config';
import * as http from 'http';
import CommandLineRunner from './modules/core/system/command-line.runner';
import app from './modules/core/app';
import envConfig from './modules/core/config/env.config';
import AppLogger from './modules/common/app.logger';

async function main() {
  const logger = AppLogger.init(main.name).logger;
  await CommandLineRunner.up();
  await CommandLineRunner.preload();

  const config = envConfig();
  const port = config.service.port;
  const server = http.createServer(app);

  server.listen(port, () => logger.info(`server running on port: ${port}`));
}

void main();
