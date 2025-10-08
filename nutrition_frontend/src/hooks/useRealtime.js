import { useEffect, useRef } from 'react';
import { getSupabaseClient } from '../lib/supabaseClient';

/**
 * PUBLIC_INTERFACE
 * useRealtime
 * Subscribes to a Supabase realtime channel for postgres_changes.
 * Accepts a channel key, an array of event configs, and optional enabled flag.
 *
 * Example:
 * useRealtime(`messages-${conversationId}`, [
 *   {
 *     event: 'INSERT',
 *     schema: 'public',
 *     table: 'messages',
 *     filter: `conversation_id=eq.${conversationId}`,
 *     handler: (payload) => { ... },
 *   }
 * ], enabled)
 */
export function useRealtime(channelKey, events = [], enabled = true) {
  const supabase = getSupabaseClient();
  const channelRef = useRef(null);

  useEffect(() => {
    if (!enabled || !channelKey) return () => {};

    // Clean up previous
    if (channelRef.current) {
      try { supabase.removeChannel(channelRef.current); } catch {}
      channelRef.current = null;
    }

    let ch = supabase.channel(channelKey);
    events.forEach((e) => {
      if (!e?.event || !e?.schema || !e?.table) return;
      ch = ch.on(
        'postgres_changes',
        { event: e.event, schema: e.schema, table: e.table, filter: e.filter },
        (payload) => e.handler?.(payload)
      );
    });
    ch.subscribe();
    channelRef.current = ch;

    return () => {
      try { supabase.removeChannel(ch); } catch {}
      channelRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelKey, enabled, JSON.stringify(events)]);
}
