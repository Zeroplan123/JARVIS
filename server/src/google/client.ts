import { google } from 'googleapis';
import type { OAuth2Client } from 'googleapis-common';
import type { OAuthTokens } from '../types/session.js';
import { decryptJson, encryptJson } from '../utils/crypto.js';
import { AppError } from '../utils/errors.js';
import { getOAuthClient } from './oauth.js';

export function loadTokensFromSession(req: { session?: any }): OAuthTokens | null {
  const enc = req.session?.oauth?.tokensEnc;
  if (!enc) return null;
  return decryptJson<OAuthTokens>(enc);
}

export function saveTokensToSession(req: { session?: any }, tokens: OAuthTokens) {
  if (!req.session) throw new AppError('Missing session', 401, 'UNAUTHORIZED');
  req.session.oauth = req.session.oauth || {};
  req.session.oauth.tokensEnc = encryptJson(tokens);
}

export async function getAuthedClient(req: { session?: any }): Promise<OAuth2Client> {
  const oauth2 = getOAuthClient();
  const tokens = loadTokensFromSession(req);
  if (!tokens?.access_token) {
    throw new AppError('Not authenticated', 401, 'UNAUTHORIZED');
  }

  oauth2.setCredentials(tokens as any);

  oauth2.on('tokens', (newTokens: any) => {
    const merged: OAuthTokens = {
      ...tokens,
      ...newTokens,
      expiry_date: newTokens.expiry_date ?? tokens.expiry_date,
      refresh_token: newTokens.refresh_token ?? tokens.refresh_token,
    };
    try {
      saveTokensToSession(req, merged);
    } catch {
      // ignore
    }
  });

  // Force refresh if needed
  if (tokens.expiry_date && tokens.expiry_date <= Date.now() + 60_000) {
    if (!tokens.refresh_token) {
      throw new AppError('Missing refresh token', 401, 'UNAUTHORIZED');
    }
    const refreshed = await oauth2.refreshAccessToken();
    const merged: OAuthTokens = {
      ...tokens,
      ...refreshed.credentials,
      refresh_token: refreshed.credentials.refresh_token ?? tokens.refresh_token,
    };
    saveTokensToSession(req, merged);
    oauth2.setCredentials(merged as any);
  }

  return oauth2;
}

export function calendarApi(auth: OAuth2Client) {
  return google.calendar({ version: 'v3', auth });
}

export function gmailApi(auth: OAuth2Client) {
  return google.gmail({ version: 'v1', auth });
}
