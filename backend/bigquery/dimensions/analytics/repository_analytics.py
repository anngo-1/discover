from typing import Dict, Any
import pandas as pd
from ..DimensionsFilter import DimensionsFilter

class RepositoryAnalytics(DimensionsFilter):
    def analyze(self, dataset_name: str, filters: Dict[str, Any]) -> pd.DataFrame:
        """Analyze data repository usage patterns"""
        query = f"""
        WITH repository_metrics AS (
            SELECT 
                year,
                repository_dois[OFFSET(0)] as repository,
                COUNT(DISTINCT id) as dataset_count,
                COUNT(DISTINCT authors.researcher_id) as unique_depositors,
                AVG(citations_count) as avg_citations,
                COUNT(DISTINCT categories.for_2020_v2022.first_level.full[SAFE_OFFSET(0)].name) as research_fields,
                STRING_AGG(DISTINCT categories.for_2020_v2022.first_level.full[SAFE_OFFSET(0)].name, ', ') as field_names,
                COUNT(DISTINCT ARRAY_TO_STRING(research_org_countries, ',')) as contributing_countries
            FROM `{self.bq.datasets[dataset_name].full_path}`,
            UNNEST(authors) as authors
            WHERE {self.build_where_clause(filters)}
            AND ARRAY_LENGTH(repository_dois) > 0
            GROUP BY year, repository_dois[OFFSET(0)]
            ORDER BY year DESC, dataset_count DESC
        )
        SELECT * FROM repository_metrics
        """
        return self.execute_query(dataset_name, query)