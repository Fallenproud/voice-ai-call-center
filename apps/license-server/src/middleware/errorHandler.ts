import { Request, Response, NextFunction } from 'express';

interface ErrorResponse {
  error: string;
  message: string;
  status?: number;
  details?: any;
  timestamp: string;
  path: string;
}

export function errorHandler(
  error: Error & { status?: number; details?: any },
  req: Request,
  res: Response,
  next: NextFunction
) {
  const status = error.status || 500;
  const message = error.message || 'Internal Server Error';

  const errorResponse: ErrorResponse = {
    error: error.name || 'Error',
    message,
    status,
    timestamp: new Date().toISOString(),
    path: req.path,
  };

  // Add details in development mode
  if (process.env.NODE_ENV === 'development') {
    errorResponse.details = {
      stack: error.stack,
      details: error.details,
    };
  }

  // Log error
  console.error(`[${new Date().toISOString()}] ${status} ${message}`, {
    path: req.path,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    error: error.stack,
  });

  // Send error response
  res.status(status).json(errorResponse);
}