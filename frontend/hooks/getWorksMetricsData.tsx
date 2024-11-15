import { WorksFilterState, WorksMetricsState } from '@/libs/types';
import { useState, useEffect } from 'react';

const initialMetricsState: WorksMetricsState = {
    quickMetrics: {
      totalPapers: 0,
      totalCitations: 0,
      averageCitations: 0
    },
    visualizationData: {
      timeSeriesData: [],
      stackedData: []
    },
    groupingsData: {
      funders: {},
      publishers: {},
      openAccess: {}
    }
  };
const useMetricsData = (filters: WorksFilterState) => {
  const [metrics, setMetrics] = useState<WorksMetricsState>(initialMetricsState);
  const [loading, setLoading] = useState({
    quickMetrics: false,
    visualizations: false,
    groupings: false
  });
  const [error, setError] = useState<string | null>(null);
  const host = process.env.NEXT_PUBLIC_HOST;

  const fetchData = async (endpoint: string) => {
    const response = await fetch(`${host}${endpoint}?filter=${encodeURIComponent(JSON.stringify(filters))}`);
    if (!response.ok) throw new Error(`Failed to fetch ${endpoint} data`);
    return response.json();
  };

  useEffect(() => {
    const getQuickMetrics = async () => {
      try {
        setLoading(prev => ({ ...prev, quickMetrics: true }));
        const data = await fetchData('/works/publications');
        setMetrics(prev => ({
          ...prev,
          quickMetrics: {
            totalPapers: data.total_count || 0,
            totalCitations: data.cited_by_count || 0,
            averageCitations: data.total_count > 0 ? (data.cited_by_count / data.total_count) : 0
          }
        }));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
      } finally {
        setLoading(prev => ({ ...prev, quickMetrics: false }));
      }
    };

    const getVisualizations = async () => {
      try {
        setLoading(prev => ({ ...prev, visualizations: true }));
        const data = await fetchData('/works/works_metrics');
        
        const timeSeriesData = data.timeline.map((entry: any) => ({
          year: Number(entry.period),
          total_results: Number(entry.total || 0),
          total_citations: Number(entry.cited_by_count || 0)
        }));

        const stackedData = data.timeline.map((entry: any) => ({
          year: Number(entry.period),
          articles: entry.types?.find((t: any) => t.name.toLowerCase() === 'article')?.count || 0,
          preprints: entry.types?.find((t: any) => t.name.toLowerCase() === 'preprint')?.count || 0,
          datasets: entry.types?.find((t: any) => t.name.toLowerCase() === 'dataset')?.count || 0
        }));

        setMetrics(prev => ({
          ...prev,
          visualizationData: { timeSeriesData, stackedData }
        }));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch visualizations');
      } finally {
        setLoading(prev => ({ ...prev, visualizations: false }));
      }
    };

    const getGroupings = async () => {
      try {
        setLoading(prev => ({ ...prev, groupings: true }));
        const data = await fetchData('/works/group_metrics');
        
        setMetrics(prev => ({
          ...prev,
          groupingsData: {
            funders: data.funders || {},
            publishers: data.publishers || {},
            openAccess: data.open_access || {}
          }
        }));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch groupings');
      } finally {
        setLoading(prev => ({ ...prev, groupings: false }));
      }
    };

    getQuickMetrics();
    getVisualizations();
    getGroupings();
  }, [filters, host]);

  return { metrics, loading, error };
};


export default useMetricsData