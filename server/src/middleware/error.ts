import type { NextFunction, Request, Response } from 'express';
import { toAppError } from '../utils/errors.js';

export function errorMiddleware(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  const appErr = toAppError(err);
  res.status(appErr.status).json({
    ok: false,
    error: {
      code: appErr.code,
      message: appErr.message,
      details: appErr.details,
    },
  });
}
