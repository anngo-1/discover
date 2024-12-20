from typing import Dict, Any
import pandas as pd
from ..DimensionsFilter import DimensionsFilter
class TopicAnalytics(DimensionsFilter):
    def analyze(self, dataset_name: str, filters: Dict[str, Any]) -> pd.DataFrame:
        """Analyze research topics and themes, with aggregated data for all years"""
        query = f"""
        WITH base_metrics AS (
            SELECT 
                year,
                concepts.concept,
                concepts.relevance,
                id,
                citations_count,
                metrics.field_citation_ratio,
                journal.title as journal_title,
                categories.for_2020_v2022.first_level.full[SAFE_OFFSET(0)].name as field_name,
                research_org_countries
            FROM `{self.bq.datasets[dataset_name].full_path}`,
            UNNEST(concepts) as concepts
            WHERE {self.build_where_clause(filters)}
            AND concepts.relevance > 0.6
        ),
        topic_summary AS (
            SELECT 
                year,
                concept,
                COUNT(*) as publication_count,
                AVG(citations_count) as avg_citations,
                AVG(field_citation_ratio) as field_impact,
                COUNT(DISTINCT field_name) as research_fields,
                COUNT(DISTINCT ARRAY_TO_STRING(research_org_countries, ',')) as collaborating_countries,
                STRING_AGG(DISTINCT journal_title ORDER BY journal_title LIMIT 5) as top_journals
            FROM base_metrics
            GROUP BY year, concept
            HAVING publication_count >= 5
        ),
        topic_trends AS (
            SELECT 
                year,  -- Keep year as an integer
                concept,
                publication_count,
                avg_citations,
                field_impact,
                research_fields,
                collaborating_countries,
                top_journals,
                LAG(publication_count) OVER(PARTITION BY concept ORDER BY year) as prev_count,
                LAG(publication_count, 2) OVER(PARTITION BY concept ORDER BY year) as prev_prev_count
            FROM topic_summary
        ),
        aggregated_topics AS (
            SELECT 
                9999 as year,  -- Use integer 9999 for aggregated data
                concept,
                SUM(publication_count) as publication_count,
                AVG(avg_citations) as avg_citations,
                AVG(field_impact) as field_impact,
                MAX(research_fields) as research_fields,
                MAX(collaborating_countries) as collaborating_countries,
                STRING_AGG(DISTINCT top_journals ORDER BY top_journals LIMIT 5) as top_journals,
                NULL as yoy_growth,
                NULL as two_year_growth
            FROM topic_trends
            GROUP BY concept
        )
        SELECT 
            year,
            concept,
            publication_count,
            avg_citations,
            field_impact,
            research_fields,
            collaborating_countries,
            top_journals,
            CASE 
                WHEN prev_count > 0 THEN (publication_count - prev_count) / prev_count
                ELSE 0 
            END as yoy_growth,
            CASE 
                WHEN prev_prev_count > 0 
                THEN (publication_count - prev_prev_count) / prev_prev_count 
                ELSE 0
            END as two_year_growth
        FROM topic_trends
        UNION ALL
        SELECT 
            year,
            concept,
            publication_count,
            avg_citations,
            field_impact,
            research_fields,
            collaborating_countries,
            top_journals,
            yoy_growth,
            two_year_growth
        FROM aggregated_topics
        ORDER BY year DESC, publication_count DESC
        LIMIT 1000
        """
        return self.execute_query(dataset_name, query)
