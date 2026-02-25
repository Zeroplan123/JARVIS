import React, { useMemo, useState } from 'react';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import { googleAssistantApi, type EmailSendInput } from '../services/googleAssistantApi';
import { ConfirmBar } from './ConfirmBar';

export const EmailPanel: React.FC = () => {
  const { authenticated } = useGoogleAuth();

  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<any>(null);
  const [sentId, setSentId] = useState<string | null>(null);

  const payload: EmailSendInput = useMemo(() => ({ to: to.trim(), subject: subject.trim() || '(no subject)', body }), [to, subject, body]);

  async function doPreview() {
    setBusy(true);
    setSentId(null);
    try {
      const res = await googleAssistantApi.previewSendEmail(payload);
      setPreview(res.preview);
    } finally {
      setBusy(false);
    }
  }

  async function doConfirm() {
    setBusy(true);
    setSentId(null);
    try {
      const res = await googleAssistantApi.sendEmail(payload);
      setSentId(res.id);
      setPreview(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="jarvis-surface p-5" style={{ borderRadius: 'var(--r-2)' }}>
      <div>
        <div className="text-xs font-medium tracking-[0.18em] text-[var(--text-3)]">GMAIL</div>
        <div className="mt-2 text-base font-semibold tracking-[-0.01em]">Draft + send</div>
        <div className="mt-2 text-sm text-[var(--text-2)]">Always preview before sending. Confirm triggers Gmail API send.</div>
      </div>

      {!authenticated && (
        <div className="mt-4 text-sm text-[var(--text-2)]">Connect your Google account to use Gmail sending.</div>
      )}

      <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-5">
          <label className="block text-xs font-medium tracking-[0.12em] text-[var(--text-3)]">TO</label>
          <input
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="jarvis-input mt-2 w-full h-11 px-4 text-sm focus:outline-none"
            style={{ borderRadius: 'var(--r-1)' }}
            placeholder="john@example.com"
            disabled={!authenticated}
          />
        </div>
        <div className="md:col-span-7">
          <label className="block text-xs font-medium tracking-[0.12em] text-[var(--text-3)]">SUBJECT</label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="jarvis-input mt-2 w-full h-11 px-4 text-sm focus:outline-none"
            style={{ borderRadius: 'var(--r-1)' }}
            placeholder="Project update"
            disabled={!authenticated}
          />
        </div>
        <div className="md:col-span-12">
          <label className="block text-xs font-medium tracking-[0.12em] text-[var(--text-3)]">BODY</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="jarvis-input mt-2 w-full min-h-[120px] px-4 py-3 text-sm focus:outline-none"
            style={{ borderRadius: 'var(--r-1)' }}
            placeholder="Write the email content…"
            disabled={!authenticated}
          />
        </div>
      </div>

      <div className="mt-4">
        <ConfirmBar
          title="Send email"
          detail="Preview the payload before sending."
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

      {sentId && (
        <div className="mt-3 text-xs font-mono text-[var(--text-2)]">sent_id={sentId}</div>
      )}
    </section>
  );
};
