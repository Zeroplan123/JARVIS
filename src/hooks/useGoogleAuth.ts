import { useCallback, useEffect, useState } from 'react';
import { googleAssistantApi } from '../services/googleAssistantApi';

export function useGoogleAuth() {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await googleAssistantApi.authMe();
      setAuthenticated(res.authenticated);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to check auth');
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const login = useCallback(async () => {
    setError(null);
    const res = await googleAssistantApi.authGoogleUrl();
    window.location.assign(res.url);
  }, []);

  const logout = useCallback(async () => {
    setError(null);
    await googleAssistantApi.logout();
    await refresh();
  }, [refresh]);

  return { authenticated, loading, error, refresh, login, logout };
}
