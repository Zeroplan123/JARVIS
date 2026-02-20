import React, { useMemo, useState } from 'react';
import { googleAssistantApi, type CalendarEventInput, type EmailSendInput } from '../services/googleAssistantApi';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import { ConfirmBar } from './ConfirmBar';

type PlannedAction =
  | { kind: 'calendar_create'; payload: CalendarEventInput }
  | { kind: 'email_send'; payload: EmailSendInput }
  | { kind: 'unknown'; reason: string };

function parseCommand(text: string): PlannedAction {
  const t = text.trim();
  const lower = t.toLowerCase();

  // Very conservative baseline parser (extend later):
  // "Schedule meeting tomorrow at 3pm" / "Schedule <summary> tomorrow at <hh>(am|pm)"
  const scheduleMatch = lower.match(/^schedule\s+(.+?)\s+tomorrow\s+at\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/i);
  if (scheduleMatch) {
    const summary = scheduleMatch[1].trim();
    let hour = Number(scheduleMatch[2]);
    const minute = Number(scheduleMatch[3] || '0');
    const ampm = scheduleMatch[4];
    if (ampm?.toLowerCase() === 'pm' && hour < 12) hour += 12;
    if (ampm?.toLowerCase() === 'am' && hour === 12) hour = 0;

    const start = new Date();
    start.setDate(start.getDate() + 1);
    start.setHours(hour, minute, 0, 0);

    const end = new Date(start.getTime() + 60 * 60 * 1000);

    return {
      kind: 'calendar_create',
      payload: {
        summary,
        start: { dateTime: start.toISOString() },
        end: { dateTime: end.toISOString() },
      },
    };
  }

  // "Send email to John about project update" (requires explicit email)
  const emailMatch = lower.match(/^send\s+email\s+to\s+([^\s]+)\s+about\s+(.+)$/i);
  if (emailMatch) {
    const to = emailMatch[1].trim();
    const subject = emailMatch[2].trim();
    return {
      kind: 'email_send',
      payload: {
        to,
        subject,
        body: `Hi,\n\n${subject}\n\nRegards,`,
      },
    };
  }

  return { kind: 'unknown', reason: 'No safe parse rule matched. Use Calendar/Email panels for manual control.' };
}

export const CommandPanel: React.FC = () => {
  const { authenticated } = useGoogleAuth();
  const [text, setText] = useState('');
  const [planned, setPlanned] = useState<PlannedAction | null>(null);
  const [preview, setPreview] = useState<any>(null);
  const [busy, setBusy] = useState(false);

  const plan = useMemo(() => (planned ? planned : null), [planned]);

  function onPlan() {
    setPreview(null);
    setPlanned(parseCommand(text));
  }

  async function doPreview() {
    if (!plan || plan.kind === 'unknown') return;
    setBusy(true);
    try {
      if (plan.kind === 'calendar_create') {
        const res = await googleAssistantApi.previewCreateEvent(plan.payload);
        setPreview(res.preview);
      }
      if (plan.kind === 'email_send') {
        const res = await googleAssistantApi.previewSendEmail(plan.payload);
        setPreview(res.preview);
      }
    } finally {
      setBusy(false);
    }
  }

  async function doConfirm() {
    if (!plan || plan.kind === 'unknown') return;
    setBusy(true);
    try {
      if (plan.kind === 'calendar_create') {
        await googleAssistantApi.createEvent(plan.payload);
      }
      if (plan.kind === 'email_send') {
        await googleAssistantApi.sendEmail(plan.payload);
      }
      setPreview(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="border border-[var(--stroke-1)] bg-[var(--bg-1)] p-5" style={{ borderRadius: 'var(--r-2)' }}>
      <div>
        <div className="text-xs font-medium tracking-[0.18em] text-[var(--text-3)]">AI COMMAND</div>
        <div className="mt-2 text-base font-semibold tracking-[-0.01em]">Natural language → preview</div>
        <div className="mt-2 text-sm text-[var(--text-2)]">
          The interpreter is conservative. It will only propose actions it can safely structure and always requires confirmation.
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 h-11 px-4 text-sm border border-[var(--stroke-1)] bg-[var(--bg-2)] text-[var(--text-1)] placeholder:text-[var(--text-3)] focus:outline-none"
          style={{ borderRadius: 'var(--r-1)' }}
          placeholder='e.g. "Schedule meeting tomorrow at 3pm"'
          disabled={!authenticated}
        />
        <button
          onClick={onPlan}
          disabled={!authenticated}
          className="h-11 px-4 text-sm font-medium border border-[var(--stroke-1)] text-[var(--text-2)] hover:text-[var(--text-1)] hover:border-[var(--stroke-2)] disabled:opacity-50"
          style={{ borderRadius: 'var(--r-1)' }}
        >
          Plan
        </button>
      </div>

      {plan?.kind === 'unknown' && (
        <div className="mt-3 text-sm text-[var(--text-2)]">{plan.reason}</div>
      )}

      {plan && plan.kind !== 'unknown' && (
        <div className="mt-4">
          <ConfirmBar
            title={plan.kind === 'calendar_create' ? 'Create calendar event' : 'Send email'}
            detail="Preview first, then confirm execution."
            onPreview={() => void doPreview()}
            onConfirm={() => void doConfirm()}
            busy={!authenticated || busy}
          />
        </div>
      )}

      {planned && (
        <pre className="mt-3 text-xs border border-[var(--stroke-1)] bg-[var(--bg-2)] p-3 whitespace-pre-wrap font-mono text-[var(--text-2)]" style={{ borderRadius: 'var(--r-1)' }}>
          {JSON.stringify(planned, null, 2)}
        </pre>
      )}

      {preview && (
        <pre className="mt-3 text-xs border border-[var(--stroke-1)] bg-[var(--bg-2)] p-3 whitespace-pre-wrap font-mono text-[var(--text-2)]" style={{ borderRadius: 'var(--r-1)' }}>
          {JSON.stringify(preview, null, 2)}
        </pre>
      )}
    </section>
  );
};
