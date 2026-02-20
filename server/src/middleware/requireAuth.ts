import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/errors.js';

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const enc = req.session?.oauth?.tokensEnc;
  if (!enc) {
    next(new AppError('Not authenticated', 401, 'UNAUTHORIZED'));
    return;
  }
  next();
}
