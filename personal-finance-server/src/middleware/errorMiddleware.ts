import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';


export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  if (statusCode >= 500) {
    logger.error(`[SERVER ERROR] ${req.method} ${req.url}: ${message}`, { 
      stack: err.stack,
      body: req.body 
    });
  } else {
    logger.warn(`[CLIENT ERROR] ${req.method} ${req.url}: ${message}`);
  }

  res.status(statusCode).json({
    success: false, 
    error: message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};