import React from 'react';
import { useGoogleAuth } from '../hooks/useGoogleAuth';

export const GoogleConnectPanel: React.FC = () => {
  const { authenticated, loading, error, login, logout, refresh } = useGoogleAuth();

  return (
    <section className="jarvis-surface p-5" style={{ borderRadius: 'var(--r-2)' }}>
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="text-xs font-medium tracking-[0.18em] text-[var(--text-3)]">GOOGLE</div>
          <div className="mt-2 text-base font-semibold tracking-[-0.01em]">Account Connection</div>
          <div className="mt-2 text-sm text-[var(--text-2)]">
            OAuth session is stored in an httpOnly cookie. Calendar and Gmail requests require explicit confirmation.
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!authenticated ? (
            <button
              onClick={() => void login()}
              disabled={loading}
              className="h-9 px-3 text-sm font-medium border border-[var(--stroke-1)] text-[var(--text-2)] hover:text-[var(--text-1)] hover:border-[var(--stroke-2)] disabled:opacity-50"
              style={{ borderRadius: 'var(--r-1)' }}
            >
              Connect Google
            </button>
          ) : (
            <button
              onClick={() => void logout()}
              disabled={loading}
              className="h-9 px-3 text-sm font-medium border border-[var(--stroke-1)] text-[var(--text-2)] hover:text-[var(--text-1)] hover:border-[var(--stroke-2)] disabled:opacity-50"
              style={{ borderRadius: 'var(--r-1)' }}
            >
              Disconnect
            </button>
          )}

          <button
            onClick={() => void refresh()}
            disabled={loading}
            className="h-9 px-3 text-sm font-medium border border-[var(--stroke-1)] text-[var(--text-2)] hover:text-[var(--text-1)] hover:border-[var(--stroke-2)] disabled:opacity-50"
            style={{ borderRadius: 'var(--r-1)' }}
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs font-mono text-[var(--text-3)]">
          status={loading ? 'checking' : authenticated ? 'connected' : 'disconnected'}
        </div>
        {error && <div className="text-xs text-[var(--text-2)]">{error}</div>}
      </div>
    </section>
  );
};
