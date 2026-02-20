import React, { useMemo, useState } from 'react';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import { useUpcomingEvents } from '../hooks/useUpcomingEvents';
import { googleAssistantApi, type CalendarEventInput } from '../services/googleAssistantApi';
import { ConfirmBar } from './ConfirmBar';

function toIsoLocal(d: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

export const CalendarPanel: React.FC = () => {
  const { authenticated } = useGoogleAuth();
  const { items, loading, error, refresh } = useUpcomingEvents(authenticated);

  const [summary, setSummary] = useState('');
  const [start, setStart] = useState(() => toIsoLocal(new Date(Date.now() + 60 * 60 * 1000)));
  const [end, setEnd] = useState(() => toIsoLocal(new Date(Date.now() + 2 * 60 * 60 * 1000)));
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<any>(null);

  const payload: CalendarEventInput = useMemo(() => {
    return {
      summary: summary.trim() || 'Untitled Event',
      start: { dateTime: new Date(start).toISOString() },
      end: { dateTime: new Date(end).toISOString() },
    };
  }, [summary, start, end]);

  async function doPreview() {
    setBusy(true);
    try {
      const res = await googleAssistantApi.previewCreateEvent(payload);
      setPreview(res.preview);
    } finally {
      setBusy(false);
    }
  }

  async function doConfirm() {
    setBusy(true);
    try {
      await googleAssistantApi.createEvent(payload);
      setPreview(null);
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="border border-[var(--stroke-1)] bg-[var(--bg-1)] p-5" style={{ borderRadius: 'var(--r-2)' }}>
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="text-xs font-medium tracking-[0.18em] text-[var(--text-3)]">CALENDAR</div>
          <div className="mt-2 text-base font-semibold tracking-[-0.01em]">Upcoming events</div>
          <div className="mt-2 text-sm text-[var(--text-2)]">Create uses Preview → Confirm. Edit/delete are available from the list.</div>
        </div>
        <button
          onClick={() => void refresh()}
          disabled={!authenticated || loading}
          className="h-9 px-3 text-sm font-medium border border-[var(--stroke-1)] text-[var(--text-2)] hover:text-[var(--text-1)] hover:border-[var(--stroke-2)] disabled:opacity-50"
          style={{ borderRadius: 'var(--r-1)' }}
        >
          Refresh
        </button>
      </div>

      {!authenticated && (
        <div className="mt-4 text-sm text-[var(--text-2)]">Connect your Google account to access Calendar.</div>
      )}

      {error && <div className="mt-4 text-sm text-[var(--text-2)]">{error}</div>}

      <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-6">
          <label className="block text-xs font-medium tracking-[0.12em] text-[var(--text-3)]">SUMMARY</label>
          <input
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="mt-2 w-full h-11 px-4 text-sm border border-[var(--stroke-1)] bg-[var(--bg-2)] text-[var(--text-1)] placeholder:text-[var(--text-3)] focus:outline-none"
            style={{ borderRadius: 'var(--r-1)' }}
            placeholder="Meeting with…"
            disabled={!authenticated}
          />
        </div>
        <div className="md:col-span-3">
          <label className="block text-xs font-medium tracking-[0.12em] text-[var(--text-3)]">START</label>
          <input
            type="datetime-local"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="mt-2 w-full h-11 px-4 text-sm border border-[var(--stroke-1)] bg-[var(--bg-2)] text-[var(--text-1)] focus:outline-none"
            style={{ borderRadius: 'var(--r-1)' }}
            disabled={!authenticated}
          />
        </div>
        <div className="md:col-span-3">
          <label className="block text-xs font-medium tracking-[0.12em] text-[var(--text-3)]">END</label>
          <input
            type="datetime-local"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="mt-2 w-full h-11 px-4 text-sm border border-[var(--stroke-1)] bg-[var(--bg-2)] text-[var(--text-1)] focus:outline-none"
            style={{ borderRadius: 'var(--r-1)' }}
            disabled={!authenticated}
          />
        </div>
      </div>

      <div className="mt-4">
        <ConfirmBar
          title="Create event"
          detail="Preview the event payload before inserting into Google Calendar."
          onPreview={() => void doPreview()}
          onConfirm={() => void doConfirm()}
          busy={!authenticated || busy}
        />
      </div>

      {preview && (
        <pre className="mt-3 text-xs border border-[var(--stroke-1)] bg-[var(--bg-2)] p-3 whitespace-pre-wrap font-mono text-[var(--text-2)]" style={{ borderRadius: 'var(--r-1)' }}>
          {JSON.stringify(preview, null, 2)}
        </pre>
      )}

      <div className="mt-6 border-t border-[var(--stroke-1)] pt-5">
        <div className="text-xs font-medium tracking-[0.18em] text-[var(--text-3)]">LIST</div>
        <div className="mt-3 space-y-2">
          {loading && authenticated && (
            <div className="text-sm text-[var(--text-2)]">Loading…</div>
          )}

          {items.map((ev) => (
            <EventRow key={ev.id} ev={ev} onChanged={() => void refresh()} />
          ))}

          {!loading && authenticated && items.length === 0 && (
            <div className="text-sm text-[var(--text-2)]">No upcoming events.</div>
          )}
        </div>
      </div>
    </section>
  );
};

const EventRow: React.FC<{ ev: any; onChanged: () => void }> = ({ ev, onChanged }) => {
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<any>(null);

  const title = ev.summary || '(untitled)';
  const start = ev.start?.dateTime || ev.start?.date || '';

  async function previewDelete() {
    if (!ev.id) return;
    setBusy(true);
    try {
      const res = await googleAssistantApi.previewDeleteEvent(ev.id);
      setPreview(res.preview);
    } finally {
      setBusy(false);
    }
  }

  async function confirmDelete() {
    if (!ev.id) return;
    setBusy(true);
    try {
      await googleAssistantApi.deleteEvent(ev.id);
      setPreview(null);
      onChanged();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="border border-[var(--stroke-1)] bg-[var(--bg-2)] p-4" style={{ borderRadius: 'var(--r-1)' }}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-sm font-medium text-[var(--text-1)] truncate">{title}</div>
          <div className="mt-1 text-xs font-mono text-[var(--text-3)] truncate">{start}</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => void previewDelete()}
            disabled={busy}
            className="h-9 px-3 text-sm font-medium border border-[var(--stroke-1)] text-[var(--text-2)] hover:text-[var(--text-1)] hover:border-[var(--stroke-2)] disabled:opacity-50"
            style={{ borderRadius: 'var(--r-1)' }}
          >
            Preview Delete
          </button>
          <button
            onClick={() => void confirmDelete()}
            disabled={busy}
            className="h-9 px-3 text-sm font-medium border border-[var(--stroke-1)] disabled:opacity-50"
            style={{ borderRadius: 'var(--r-1)', borderColor: 'var(--accent)' }}
          >
            Confirm
          </button>
        </div>
      </div>
      {preview && (
        <pre className="mt-3 text-xs border border-[var(--stroke-1)] bg-[var(--bg-1)] p-3 whitespace-pre-wrap font-mono text-[var(--text-2)]" style={{ borderRadius: 'var(--r-1)' }}>
          {JSON.stringify(preview, null, 2)}
        </pre>
      )}
    </div>
  );
};
