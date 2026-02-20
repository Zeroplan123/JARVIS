import { google } from 'googleapis';
import { AppError } from '../utils/errors.js';
import { GOOGLE_SCOPES } from '../utils/googleScopes.js';

export function getOAuthClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new AppError('Missing Google OAuth env vars', 500, 'CONFIG_ERROR');
  }

  return new google.auth.OAuth2({
    clientId,
    clientSecret,
    redirectUri,
  });
}

export function getAuthUrl(state: string, codeChallenge: string) {
  const oauth2 = getOAuthClient();
  return oauth2.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: [...GOOGLE_SCOPES],
    state,
    include_granted_scopes: true,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });
}
