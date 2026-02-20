import { Router } from 'express';
import type { Request, Response } from 'express';
import { z } from 'zod';

import { requireAuth } from '../middleware/requireAuth.js';
import { AppError } from '../utils/errors.js';
import { calendarApi, getAuthedClient, gmailApi } from '../google/client.js';

export const apiRouter = Router();

apiRouter.use(requireAuth);

apiRouter.get('/calendar/upcoming', async (req: Request, res: Response) => {
  const auth = await getAuthedClient(req);
  const calendar = calendarApi(auth);

  const now = new Date();
  const timeMin = now.toISOString();

  const result = await calendar.events.list({
    calendarId: 'primary',
    timeMin,
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  });

  res.json({ ok: true, items: result.data.items || [] });
});

const eventSchema = z.object({
  summary: z.string().min(1),
  description: z.string().optional(),
  location: z.string().optional(),
  start: z.object({ dateTime: z.string().min(1), timeZone: z.string().optional() }),
  end: z.object({ dateTime: z.string().min(1), timeZone: z.string().optional() }),
  attendees: z.array(z.object({ email: z.string().email() })).optional(),
});

type ConfirmMode = 'preview' | 'confirm';

function getConfirmMode(req: any): ConfirmMode {
  const h = String(req.header('X-Confirm') || '').toLowerCase();
  if (h === 'true' || h === 'confirm') return 'confirm';
  return 'preview';
}

apiRouter.post('/calendar', async (req: Request, res: Response) => {
  const parsed = eventSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError('Invalid event payload', 400, 'BAD_REQUEST', parsed.error.flatten());
  }

  const mode = getConfirmMode(req);
  if (mode === 'preview') {
    res.json({ ok: true, preview: { action: 'create', event: parsed.data } });
    return;
  }

  const auth = await getAuthedClient(req);
  const calendar = calendarApi(auth);
  const created = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: parsed.data,
  });

  res.json({ ok: true, item: created.data });
});

apiRouter.put('/calendar/:id', async (req: Request, res: Response) => {
  const id = z.string().min(1).parse(req.params.id);
  const parsed = eventSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    throw new AppError('Invalid event payload', 400, 'BAD_REQUEST', parsed.error.flatten());
  }

  const mode = getConfirmMode(req);
  if (mode === 'preview') {
    res.json({ ok: true, preview: { action: 'update', id, patch: parsed.data } });
    return;
  }

  const auth = await getAuthedClient(req);
  const calendar = calendarApi(auth);

  const updated = await calendar.events.patch({
    calendarId: 'primary',
    eventId: id,
    requestBody: parsed.data,
  });

  res.json({ ok: true, item: updated.data });
});

apiRouter.delete('/calendar/:id', async (req: Request, res: Response) => {
  const id = z.string().min(1).parse(req.params.id);

  const mode = getConfirmMode(req);
  if (mode === 'preview') {
    res.json({ ok: true, preview: { action: 'delete', id } });
    return;
  }

  const auth = await getAuthedClient(req);
  const calendar = calendarApi(auth);

  await calendar.events.delete({
    calendarId: 'primary',
    eventId: id,
  });

  res.json({ ok: true });
});

const emailSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1),
  body: z.string().min(1),
});

function buildRawEmail(to: string, subject: string, body: string) {
  const lines = [
    `To: ${to}`,
    `Subject: ${subject}`,
    'Content-Type: text/plain; charset="UTF-8"',
    '',
    body,
  ];
  const raw = lines.join('\r\n');
  return Buffer.from(raw, 'utf8').toString('base64url');
}

apiRouter.post('/email/send', async (req: Request, res: Response) => {
  const parsed = emailSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError('Invalid email payload', 400, 'BAD_REQUEST', parsed.error.flatten());
  }

  const mode = getConfirmMode(req);
  if (mode === 'preview') {
    res.json({ ok: true, preview: { action: 'send_email', ...parsed.data } });
    return;
  }

  const auth = await getAuthedClient(req);
  const gmail = gmailApi(auth);

  const raw = buildRawEmail(parsed.data.to, parsed.data.subject, parsed.data.body);
  const sent = await gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw },
  });

  res.json({ ok: true, id: sent.data.id });
});
