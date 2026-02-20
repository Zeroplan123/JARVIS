import { Router } from 'express';
import crypto from 'crypto';
import type { Request, Response } from 'express';
import { z } from 'zod';

import { getOAuthClient, getAuthUrl } from '../google/oauth.js';
import { decryptJson, encryptJson, randomBase64Url } from '../utils/crypto.js';
import { AppError } from '../utils/errors.js';
import type { OAuthTokens } from '../types/session.js';

export const authRouter = Router();

function base64Url(buf: Buffer) {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function sha256Base64Url(input: string) {
  return base64Url(crypto.createHash('sha256').update(input).digest());
}

authRouter.get('/google', (req: Request, res: Response) => {
  if (!req.session) throw new AppError('Missing session', 500, 'SESSION_ERROR');

  const state = randomBase64Url(16);
  const codeVerifier = randomBase64Url(32);
  const codeChallenge = sha256Base64Url(codeVerifier);

  req.session.oauth = {
    state,
    codeVerifier,
    tokensEnc: req.session.oauth?.tokensEnc,
  };

  const url = getAuthUrl(state, codeChallenge);
  res.json({ ok: true, url });
});

authRouter.get('/google/callback', async (req: Request, res: Response) => {
  const schema = z.object({
    code: z.string().min(1),
    state: z.string().min(1),
  });
  const parsed = schema.safeParse(req.query);
  if (!parsed.success) {
    throw new AppError('Invalid callback query', 400, 'BAD_REQUEST', parsed.error.flatten());
  }

  const { code, state } = parsed.data;
  const sessionState = req.session?.oauth?.state;
  const codeVerifier = req.session?.oauth?.codeVerifier;

  if (!sessionState || !codeVerifier || sessionState !== state) {
    throw new AppError('Invalid OAuth state', 400, 'OAUTH_STATE_MISMATCH');
  }

  const oauth2 = getOAuthClient();
  const { tokens } = await oauth2.getToken({ code, codeVerifier });

  const stored: OAuthTokens = {
    access_token: tokens.access_token || undefined,
    refresh_token: tokens.refresh_token || undefined,
    scope: tokens.scope || undefined,
    token_type: tokens.token_type || undefined,
    expiry_date: tokens.expiry_date || undefined,
  };

  if (!req.session) throw new AppError('Missing session', 500, 'SESSION_ERROR');
  req.session.oauth = req.session.oauth || {};
  req.session.oauth.tokensEnc = encryptJson(stored);

  const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
  res.redirect(clientOrigin);
});

authRouter.post('/logout', (req: Request, res: Response) => {
  if (req.session?.oauth) {
    req.session.oauth.tokensEnc = undefined;
  }
  res.json({ ok: true });
});

authRouter.get('/me', (req: Request, res: Response) => {
  const enc = req.session?.oauth?.tokensEnc;
  res.json({ ok: true, authenticated: Boolean(enc) });
});
