from typing import Dict, Any
import pandas as pd
from ..DimensionsFilter import DimensionsFilter

class ResearcherAnalytics(DimensionsFilter):
    def analyze(self, dataset_name: str, filters: Dict[str, Any]) -> pd.DataFrame:
        """Analyze researcher productivity and impact"""
        query = f"""
        WITH researcher_metrics AS (
            SELECT 
                authors.researcher_id,
                authors.first_name,
                authors.last_name,
                year,
                COUNT(DISTINCT id) as publication_count,
                AVG(citations_count) as avg_citations,
                AVG(metrics.field_citation_ratio) as field_weighted_impact,
                COUNT(DISTINCT journal.id) as unique_journals,
                STRING_AGG(DISTINCT journal.title, ', ' LIMIT 5) as top_journals,
                COUNT(DISTINCT categories.for_2020_v2022.first_level.full[SAFE_OFFSET(0)].name) as research_fields,
                STRING_AGG(DISTINCT categories.for_2020_v2022.first_level.full[SAFE_OFFSET(0)].name, ', ') as field_names,
                COUNT(DISTINCT funding_details.grant_id) as associated_grants,
                COUNTIF(ARRAY_LENGTH(open_access_categories) > 0) as open_access_papers,
                COUNTIF(ARRAY_LENGTH(repository_dois) > 0) as papers_with_data
            FROM `{self.bq.datasets[dataset_name].full_path}`,
            UNNEST(authors) as authors,
            UNNEST(funding_details) as funding_details
            WHERE {self.build_where_clause(filters)}
            GROUP BY authors.researcher_id, authors.first_name, authors.last_name, year
            QUALIFY ROW_NUMBER() OVER(PARTITION BY year ORDER BY publication_count DESC) <= 10
            ORDER BY year DESC, publication_count DESC
        )
        SELECT * FROM researcher_metrics
        """
        return self.execute_query(dataset_name, query)