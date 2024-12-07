import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { ValidateError } from 'tsoa';
import { logger } from '../config/logger.config';
import { config } from '../config/environment.config';

export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (err instanceof ValidateError) {
    logger.warn(`Validation error on ${req.method} ${req.url}`, {
      status: 422,
      details: err.fields,
    });

    res.status(422).json({
      message: 'Validation Failed',
      details: err.fields,
    });
    return;
  }

  if (err instanceof Error) {
    let statusCode = 500;
    let clientMessage = 'Internal Server Error';

    if (err.message.includes('not found')) {
      statusCode = 404;
      clientMessage = 'Resource Not Found';
    } else if (err.message.includes('Unauthorized')) {
      statusCode = 401;
      clientMessage = 'Unauthorized Access';
    } else if (err.message.includes('Validation')) {
      statusCode = 400;
      clientMessage = 'Validation Error';
    }

    logger.error(`Error on ${req.method} ${req.url}`, {
      status: statusCode,
      message: err.message,
      stack: err.stack,
    });

    res.status(statusCode).json({
      message: clientMessage,
      error: config.env === 'beta' ? err.message : undefined,
    });
    return;
  }

  next();
};
