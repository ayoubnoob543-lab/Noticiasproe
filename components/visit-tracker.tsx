'use client';

import * as React from 'react';
import { supabase } from '@/lib/supabase';
import { usePathname } from 'next/navigation';

export function VisitTracker() {
  const pathname = usePathname();
  const [tracked, setTracked] = React.useState(false);

  React.useEffect(() => {
    if (tracked) return;
    
    const trackVisit = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const visitData = {
        user_id: user?.id || null,
        page_url: window.location.href,
        page_title: document.title,
        referrer: document.referrer || null,
        user_agent: navigator.userAgent,
        ip_address: null,
        country: null,
        city: null,
      };

      await supabase.from('visits').insert(visitData);

      const today = new Date().toISOString().split('T')[0];

      const { data: existingStats } = await supabase
        .from('daily_visit_stats')
        .select('*')
        .eq('date', today)
        .maybeSingle();

      if (existingStats) {
        await supabase
          .from('daily_visit_stats')
          .update({
            total_visits: existingStats.total_visits + 1,
            authenticated_visits: user ? existingStats.authenticated_visits + 1 : existingStats.authenticated_visits,
            anonymous_visits: !user ? existingStats.anonymous_visits + 1 : existingStats.anonymous_visits,
          })
          .eq('id', existingStats.id);
      } else {
        await supabase.from('daily_visit_stats').insert({
          date: today,
          total_visits: 1,
          unique_visitors: 1,
          authenticated_visits: user ? 1 : 0,
          anonymous_visits: !user ? 1 : 0,
        });
      }
      
      setTracked(true);
    };

    trackVisit();
  }, [pathname, tracked]);

  return null;
}