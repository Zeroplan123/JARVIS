import express from 'express';
import cors from 'cors';
import cookieSession from 'cookie-session';
import dotenv from 'dotenv';
import type { Request, Response } from 'express';

import { authRouter } from './routes/auth.js';
import { apiRouter } from './routes/api.js';
import { errorMiddleware } from './middleware/error.js';

dotenv.config();

const app = express();

const port = Number(process.env.PORT || 8787);
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error('Missing SESSION_SECRET');
}

const cookieSecure = (process.env.COOKIE_SECURE || 'false') === 'true';

app.disable('x-powered-by');

app.use(
  cors({
    origin: clientOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'X-Confirm'],
  })
);

app.use(express.json({ limit: '1mb' }));

app.use(
  cookieSession({
    name: 'jarvis_session',
    secret: sessionSecret,
    httpOnly: true,
    secure: cookieSecure,
    sameSite: cookieSecure ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
);

app.get('/health', (_req: Request, res: Response) => {
  res.json({ ok: true });
});

app.use('/auth', authRouter);
app.use('/api', apiRouter);

app.use(errorMiddleware);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`[server] listening on http://localhost:${port}`);
});
