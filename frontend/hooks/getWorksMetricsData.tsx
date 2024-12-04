import { WorksFilterState } from '@/libs/types';
import { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';

export interface TopItem {
  author?: string;
  journal?: string;
  publisher?: string;
  term?: string;
  org?: string;
  country?: string;
  funder?: string;
  concept_text?: string;
  count: number;
  term_count?: number;
  concept_count?: number;
}

export interface SDGCategory {
  code: string;
  name: string;
  sdg_count: number;
}

export interface DocTypeCount {
  doc_type: string | null;
  doc_count: number;
}

export interface OpenAccessType {
  category: string;
  count: number;
}

export interface YearMetrics {
  open_access_types: OpenAccessType[];
  top_authors: TopItem[];
  top_journals: TopItem[];
  top_publishers: TopItem[];
  top_mesh_terms: TopItem[];
  doc_type_counts: DocTypeCount[];
  top_collaborating_institutions: TopItem[];
  top_countries: TopItem[];
  top_funders: TopItem[];
  top_concepts: TopItem[];
  sdg_categories: SDGCategory[];

  total_clinical_trials: number;
  total_patents: number;
  total_repository_deposits: number;
  book_review_count: number;
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
  unique_countries_count: number;
  avg_authors_per_publication: number;
  total_funding_instances: number;
}

interface MetricsData {
  data: Record<string, YearMetrics>;
}

const useMetricsData = (filters: WorksFilterState) => {
  const [data, setData] = useState<MetricsData>({ data: {} }); 
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

        const newData: MetricsData = await response.json();

        const processedData: MetricsData = {
          data: Object.fromEntries(
            Object.entries(newData.data).map(([year, metrics]) => [
              year,
              {
                ...metrics,
                open_access_types: metrics.open_access_types || [],
                top_authors: metrics.top_authors || [],
                top_journals: metrics.top_journals || [],
                top_publishers: metrics.top_publishers || [],
                top_mesh_terms: metrics.top_mesh_terms || [],
                doc_type_counts: metrics.doc_type_counts || [],
                top_collaborating_institutions:
                  metrics.top_collaborating_institutions || [],
                top_countries: metrics.top_countries || [],
                top_funders: metrics.top_funders || [],
                top_concepts: metrics.top_concepts || [],
                sdg_categories: metrics.sdg_categories || [],

                total_clinical_trials: metrics.total_clinical_trials || 0,
                total_patents: metrics.total_patents || 0,
                total_repository_deposits: metrics.total_repository_deposits || 0,
                book_review_count: metrics.book_review_count || 0,
                avg_citations: metrics.avg_citations || 0,
                avg_recent_citations: metrics.avg_recent_citations || 0,
                avg_field_citation_ratio: metrics.avg_field_citation_ratio || 0,
                avg_altmetric_score: metrics.avg_altmetric_score || 0,
                avg_collaborating_countries:
                  metrics.avg_collaborating_countries || 0,
                avg_collaborating_institutions:
                  metrics.avg_collaborating_institutions || 0,
                total_publications: metrics.total_publications || 0,
                conference_paper_count: metrics.conference_paper_count || 0,
                research_article_count: metrics.research_article_count || 0,
                review_article_count: metrics.review_article_count || 0,
                editorial_count: metrics.editorial_count || 0,
                letter_to_editor_count: metrics.letter_to_editor_count || 0,
                other_conference_count: metrics.other_conference_count || 0,
                other_journal_count: metrics.other_journal_count || 0,
                reference_work_count: metrics.reference_work_count || 0,
                research_chapter_count: metrics.research_chapter_count || 0,
                unique_countries_count: metrics.unique_countries_count || 0,
                avg_authors_per_publication:
                  metrics.avg_authors_per_publication || 0,
                total_funding_instances: metrics.total_funding_instances || 0,
              },
            ])
          ),
        };

        setData(processedData); 
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