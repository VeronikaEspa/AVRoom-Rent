import morgan from 'morgan';
import { logger } from '../config/logger.config';
import { config } from '../config/environment.config';
import { RequestHandler } from 'express';

const stream = {
  write: (message: string) => logger.info(message.trim()),
};

const skip = () => config.env === 'test';

export const morganMiddleware: RequestHandler = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  { stream, skip },
);
