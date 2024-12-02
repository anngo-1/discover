import { WorksFilterState } from '@/libs/types';
import { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';
import { YearMetrics } from '@/app/works/wrappers/ResearchMetricsWrapper';

interface MetricsData {
  data: Record<string, YearMetrics>;
}

const useMetricsData = (filters: WorksFilterState) => {
  const [data, setData] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const host = process.env.NEXT_PUBLIC_HOST;

  // Create a debounced fetch function that persists between renders
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
        console.log('New metrics data:', newData);
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