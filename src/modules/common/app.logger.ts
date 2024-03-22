import { createLogger, format, Logger, transports } from 'winston';
import colors from 'colors';

import { ConsoleTransportInstance } from 'winston/lib/winston/transports';
import { LOG_LEVEL_COLOR } from './constant';

export default class AppLogger {
  private readonly module: string;
  private readonly transports: ConsoleTransportInstance;

  constructor(module: string) {
    this.transports = this.getTransports();
    this.module = module;
    this.createLogger();
  }

  private _logger?: Logger;

  get logger(): Logger {
    return <Logger>this._logger;
  }

  public static init(module: string) {
    return new AppLogger(module);
  }

  private createLogger() {
    const { errors, label, timestamp, combine } = format;

    this._logger = createLogger({
      transports: [this.transports],
      exitOnError: false,
      level: 'info',
      format: combine(errors({ stack: true }), label({ label: this.module }), timestamp({ format: 'YYYY-MM-DD hh:mm:ss a' })),
    });
  }

  private getTransports() {
    return new transports.Console({
      level: 'debug',
      format: format.printf(({ level, label, timestamp, stack, message }) => {
        const levelKey = level as keyof typeof LOG_LEVEL_COLOR;
        const colorKey = LOG_LEVEL_COLOR[levelKey];

        return colors[colorKey](`[${timestamp}] ${label}.${level}: ${stack ?? message}`);
      }),
    });
  }
}
