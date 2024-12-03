export interface YearMetrics {
  avg_citations: number;
  avg_recent_citations: number;
  avg_field_citation_ratio: number;
  avg_altmetric_score: number;
  avg_collaborating_countries: number;
  avg_collaborating_institutions: number;
  total_publications: number;
  conference_paper_count: number;
  research_article_count: number;
  review_article_count: number;
  editorial_count: number;
  letter_to_editor_count: number;
  other_conference_count: number;
  other_journal_count: number;
  reference_work_count: number;
  research_chapter_count: number;
  top_concepts: { concept_text: string; concept_count: number }[];
  sdg_categories: { name: string; sdg_count: number }[];
}

import { WorksFilterState } from '@/libs/types';
import { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';

interface MetricsData {
  data: Record<string, YearMetrics>;
}

const useMetricsData = (filters: WorksFilterState) => {
  const [data, setData] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const host = process.env.NEXT_PUBLIC_HOST;

  const debouncedFetch = useCallback(
    debounce(async (filters: WorksFilterState, signal: AbortSignal) => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `${host}/works/dimensions/stats?filter=${encodeURIComponent(
            JSON.stringify(filters)
          )}`,
          { signal }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Failed to fetch metrics: ${response.status} ${response.statusText} - ${errorText}`
          );
        }

        const newData = await response.json();
        setData(newData);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
        console.error('Metrics fetch error:', err);
      } finally {
        setLoading(false);
      }
    }, 500),
    [host]
  );

  useEffect(() => {
    const abortController = new AbortController();
    debouncedFetch(filters, abortController.signal);
    return () => {
      debouncedFetch.cancel();
      abortController.abort();
    };
  }, [filters, debouncedFetch]);

  return { data, loading, error };
};

export default useMetricsData;