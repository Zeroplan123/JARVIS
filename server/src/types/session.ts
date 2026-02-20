export type OAuthTokens = {
  access_token?: string;
  refresh_token?: string;
  scope?: string;
  token_type?: string;
  expiry_date?: number;
};

export type SessionData = {
  oauth?: {
    state?: string;
    codeVerifier?: string;
    tokensEnc?: string;
  };
};
