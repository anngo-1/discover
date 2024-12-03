from typing import Dict, Any
import pandas as pd
from ..DimensionsFilter import DimensionsFilter

class TrendAnalytics(DimensionsFilter):
    def analyze(self, dataset_name: str, filters: Dict[str, Any]) -> pd.DataFrame:
        """Analyze research trends and patterns over time"""
        query = f"""
        WITH yearly_field_metrics AS (
            SELECT 
                p.year,
                field.name as field_name,
                COUNT(DISTINCT p.id) as publication_count,
                AVG(p.citations_count) as avg_citations,
                AVG(p.metrics.field_citation_ratio) as field_impact,
                COUNT(DISTINCT a.researcher_id) as unique_authors,
                COUNT(DISTINCT ARRAY_TO_STRING(p.research_org_countries, ',')) as collaborating_countries,
                COUNTIF(ARRAY_LENGTH(p.open_access_categories) > 0) / COUNT(*) as open_access_ratio,
                COUNT(DISTINCT p.journal.id) as unique_journals,
                COUNT(DISTINCT f.grant_id) as unique_grants,
                -- Additional trend metrics
                COUNTIF(p.citations_count > 50) / COUNT(*) as high_impact_ratio,
                COUNT(DISTINCT p.publisher.name) as unique_publishers,
                STRING_AGG(DISTINCT 
                    CASE 
                        WHEN ARRAY_LENGTH(p.concepts) > 0 THEN p.concepts[OFFSET(0)].concept 
                        ELSE NULL 
                    END, 
                    ', ' LIMIT 5) as top_concepts
            FROM `{self.bq.datasets[dataset_name].full_path}` p,
            UNNEST(categories.for_2020_v2022.first_level.full) as field,
            UNNEST(authors) as a,
            UNNEST(funding_details) as f
            WHERE {self.build_where_clause(filters)}
            GROUP BY p.year, field.name
        ),
        trend_analysis AS (
            SELECT 
                *,
                LAG(publication_count) OVER(PARTITION BY field_name ORDER BY year) as prev_year_count,
                LAG(avg_citations) OVER(PARTITION BY field_name ORDER BY year) as prev_year_citations,
                LAG(unique_authors) OVER(PARTITION BY field_name ORDER BY year) as prev_year_authors
            FROM yearly_field_metrics
        )
        SELECT 
            *,
            CASE 
                WHEN prev_year_count > 0 
                THEN (publication_count - prev_year_count) / prev_year_count 
                ELSE 0 
            END as publication_growth,
            CASE 
                WHEN prev_year_citations > 0 
                THEN (avg_citations - prev_year_citations) / prev_year_citations 
                ELSE 0 
            END as citation_growth,
            CASE 
                WHEN prev_year_authors > 0 
                THEN (unique_authors - prev_year_authors) / prev_year_authors 
                ELSE 0 
            END as researcher_growth
        FROM trend_analysis
        ORDER BY year DESC, publication_count DESC
        """
        return self.execute_query(dataset_name, query)