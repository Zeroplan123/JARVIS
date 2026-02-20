import React from 'react';

export const ConfirmBar: React.FC<{
  title: string;
  detail?: string;
  onPreview: () => void;
  onConfirm: () => void;
  busy?: boolean;
}> = ({ title, detail, onPreview, onConfirm, busy }) => {
  return (
    <div className="border border-[var(--stroke-1)] bg-[var(--bg-2)] px-4 py-3 flex items-center justify-between gap-4" style={{ borderRadius: 'var(--r-1)' }}>
      <div className="min-w-0">
        <div className="text-sm font-medium text-[var(--text-1)] truncate">{title}</div>
        {detail && <div className="text-xs text-[var(--text-3)] mt-0.5 truncate">{detail}</div>}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onPreview}
          disabled={busy}
          className="h-9 px-3 text-sm font-medium border border-[var(--stroke-1)] text-[var(--text-2)] hover:text-[var(--text-1)] hover:border-[var(--stroke-2)] disabled:opacity-50"
          style={{ borderRadius: 'var(--r-1)' }}
        >
          Preview
        </button>
        <button
          onClick={onConfirm}
          disabled={busy}
          className="h-9 px-3 text-sm font-medium border border-[var(--stroke-1)] disabled:opacity-50"
          style={{ borderRadius: 'var(--r-1)', borderColor: 'var(--accent)', color: 'var(--text-1)' }}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};
