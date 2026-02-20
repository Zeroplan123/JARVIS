import { useCallback, useEffect, useState } from 'react';
import { googleAssistantApi, type CalendarEvent } from '../services/googleAssistantApi';

export function useUpcomingEvents(enabled: boolean) {
  const [items, setItems] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    try {
      const res = await googleAssistantApi.getUpcomingEvents();
      setItems(res.items);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load events');
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { items, loading, error, refresh };
}
