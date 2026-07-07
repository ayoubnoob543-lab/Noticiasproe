'use client';

import * as React from 'react';
import { supabase, VisitRow, DailyVisitStatsRow } from '@/lib/supabase';
import { useAuth } from './use-auth';

export function useVisits() {
  const { isAdmin, user } = useAuth();
  const [visits, setVisits] = React.useState<VisitRow[]>([]);
  const [dailyStats, setDailyStats] = React.useState<DailyVisitStatsRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [totalStats, setTotalStats] = React.useState({
    total: 0,
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
  });

  const fetchVisits = React.useCallback(async () => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const [visitsResult, statsResult] = await Promise.all([
      supabase
        .from('visits')
        .select('*')
        .order('visited_at', { ascending: false })
        .limit(100),
      supabase
        .from('daily_visit_stats')
        .select('*')
        .order('date', { ascending: false })
        .limit(30),
    ]);

    if (visitsResult.data) {
      setVisits(visitsResult.data as VisitRow[]);
    }

    if (statsResult.data) {
      setDailyStats(statsResult.data as DailyVisitStatsRow[]);

      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const total = statsResult.data.reduce((sum: number, s: DailyVisitStatsRow) => sum + s.total_visits, 0);
      const todayCount = statsResult.data.find((s: DailyVisitStatsRow) => s.date === today)?.total_visits || 0;
      const thisWeek = statsResult.data
        .filter((s: DailyVisitStatsRow) => s.date >= weekAgo)
        .reduce((sum: number, s: DailyVisitStatsRow) => sum + s.total_visits, 0);
      const thisMonth = statsResult.data
        .filter((s: DailyVisitStatsRow) => s.date >= monthAgo)
        .reduce((sum: number, s: DailyVisitStatsRow) => sum + s.total_visits, 0);

      setTotalStats({ total, today: todayCount, thisWeek, thisMonth });
    }

    setLoading(false);
  }, [isAdmin]);

  const trackVisit = React.useCallback(async (pageUrl: string, pageTitle: string) => {
    const visitData: Omit<VisitRow, 'id' | 'visited_at'> = {
      user_id: user?.id || null,
      page_url: pageUrl,
      page_title: pageTitle,
      referrer: typeof document !== 'undefined' ? document.referrer || null : null,
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
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
  }, [user]);

  React.useEffect(() => {
    if (isAdmin) {
      fetchVisits();
    }
  }, [isAdmin, fetchVisits]);

  return {
    visits,
    dailyStats,
    totalStats,
    loading,
    trackVisit,
    refetch: fetchVisits,
  };
}