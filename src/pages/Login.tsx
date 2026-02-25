import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useGoogleAuth } from '../hooks/useGoogleAuth';

export function Login() {
  const navigate = useNavigate();
  const { authenticated, loading, error, login, refresh } = useGoogleAuth();

  useEffect(() => {
    if (authenticated) navigate('/app', { replace: true });
  }, [authenticated, navigate]);

  return (
    <div className="min-h-screen bg-[var(--bg-0)] text-[var(--text-1)] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-[440px]">
        <div className="mb-6">
          <Link to="/" className="text-xs font-medium tracking-[0.18em] text-[var(--text-3)]">
            ← BACK TO HOME
          </Link>
        </div>

        <div className="jarvis-surface p-6" style={{ borderRadius: 'var(--r-2)', boxShadow: 'var(--shadow-2)' }}>
          <div className="text-xs font-medium tracking-[0.18em] text-[var(--text-3)]">WELCOME BACK</div>
          <h1 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">Login</h1>
          <p className="mt-2 text-sm text-[var(--text-2)] leading-6">
            Sign in securely using your Google account. Your session is stored in an httpOnly cookie.
          </p>

          <div className="mt-6 space-y-3">
            <button
              onClick={() => void login()}
              disabled={loading}
              className="mt-2 w-full h-11 px-4 text-sm font-medium border border-[var(--stroke-1)] bg-[var(--text-1)] text-[var(--bg-0)] hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ borderRadius: 'var(--r-1)', boxShadow: 'var(--shadow-1)' }}
              type="button"
            >
              {loading ? 'Checking…' : 'Continue with Google'}
            </button>

            <button
              onClick={() => void refresh()}
              disabled={loading}
              className="w-full h-10 px-4 text-sm font-medium border border-[var(--stroke-1)] text-[var(--text-2)] hover:text-[var(--text-1)] hover:border-[var(--stroke-2)] disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ borderRadius: 'var(--r-1)' }}
              type="button"
            >
              Refresh status
            </button>

            {error && <div className="text-xs text-[var(--text-2)]">{error}</div>}

            <div className="pt-2 text-sm text-[var(--text-2)]">
              Don’t have an account?
              <Link to="/register" className="ml-2 text-[var(--text-1)] underline underline-offset-4" style={{ textDecorationColor: 'rgba(59, 130, 246, 0.35)' }}>
                Register
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 text-xs text-[var(--text-3)]">
          Tip: keep the server running on
          <span className="mx-1 font-mono">localhost:8787</span>
          for auth.
        </div>
      </div>
    </div>
  );
}
