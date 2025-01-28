import * as winston from 'winston';

export const RequestLogOptions = {
  level: 'info',
  filename: 'logs/%DATE%-request.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: false,
  maxFiles: '30d',
};

export const ErrorLogOptions = {
  // %DATE will be replaced by the current date
  filename: `logs/%DATE%-error.log`,
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: false, // don't want to zip our logs
  maxFiles: '30d', // will keep log until they are older than 30 days
};
