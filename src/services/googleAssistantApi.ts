import { apiFetch } from './backendClient';

export type CalendarEvent = {
  id?: string;
  summary?: string;
  description?: string;
  location?: string;
  start?: { dateTime?: string; date?: string; timeZone?: string };
  end?: { dateTime?: string; date?: string; timeZone?: string };
  attendees?: { email: string }[];
};

export type CalendarEventInput = {
  summary: string;
  description?: string;
  location?: string;
  start: { dateTime: string; timeZone?: string };
  end: { dateTime: string; timeZone?: string };
  attendees?: { email: string }[];
};

export type EmailSendInput = {
  to: string;
  subject: string;
  body: string;
};

export const googleAssistantApi = {
  async authMe() {
    return apiFetch<{ ok: true; authenticated: boolean }>('/auth/me');
  },

  async authGoogleUrl() {
    return apiFetch<{ ok: true; url: string }>('/auth/google');
  },

  async logout() {
    return apiFetch<{ ok: true }>('/auth/logout', { method: 'POST' });
  },

  async getUpcomingEvents() {
    return apiFetch<{ ok: true; items: CalendarEvent[] }>('/api/calendar/upcoming');
  },

  async previewCreateEvent(payload: CalendarEventInput) {
    return apiFetch<{ ok: true; preview: any }>('/api/calendar', { method: 'POST', body: payload });
  },

  async createEvent(payload: CalendarEventInput) {
    return apiFetch<{ ok: true; item: CalendarEvent }>('/api/calendar', { method: 'POST', body: payload, confirm: true });
  },

  async previewUpdateEvent(id: string, patch: Partial<CalendarEventInput>) {
    return apiFetch<{ ok: true; preview: any }>(`/api/calendar/${encodeURIComponent(id)}`, { method: 'PUT', body: patch });
  },

  async updateEvent(id: string, patch: Partial<CalendarEventInput>) {
    return apiFetch<{ ok: true; item: CalendarEvent }>(`/api/calendar/${encodeURIComponent(id)}`, { method: 'PUT', body: patch, confirm: true });
  },

  async previewDeleteEvent(id: string) {
    return apiFetch<{ ok: true; preview: any }>(`/api/calendar/${encodeURIComponent(id)}`, { method: 'DELETE' });
  },

  async deleteEvent(id: string) {
    return apiFetch<{ ok: true }>(`/api/calendar/${encodeURIComponent(id)}`, { method: 'DELETE', confirm: true });
  },

  async previewSendEmail(payload: EmailSendInput) {
    return apiFetch<{ ok: true; preview: any }>('/api/email/send', { method: 'POST', body: payload });
  },

  async sendEmail(payload: EmailSendInput) {
    return apiFetch<{ ok: true; id: string }>('/api/email/send', { method: 'POST', body: payload, confirm: true });
  },
};
