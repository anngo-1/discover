from typing import Dict, Any
import pandas as pd
from ..DimensionsFilter import DimensionsFilter

class InstitutionalAnalytics(DimensionsFilter):
    def analyze(self, dataset_name: str, filters: Dict[str, Any]) -> pd.DataFrame:
        """Analyze institutional research impact and patterns"""
        query = f"""
        WITH impact_metrics AS (
            SELECT 
                year,
                COUNT(DISTINCT id) as publication_count,
                AVG(citations_count) as avg_citations,
                AVG(metrics.field_citation_ratio) as field_weighted_impact,
                AVG(metrics.relative_citation_ratio) as relative_citation_ratio,
                COUNTIF(citations_count = 0) as uncited_papers,
                COUNTIF(citations_count > 50) as highly_cited_papers,
                COUNTIF(metrics.field_citation_ratio > 1.0) / COUNT(*) as above_field_average_ratio,
                COUNT(DISTINCT categories.for_2020_v2022.first_level.full[SAFE_OFFSET(0)].name) as unique_fields,
                COUNT(DISTINCT ARRAY_TO_STRING(research_org_countries, ',')) as countries_reached,
                COUNTIF(ARRAY_LENGTH(open_access_categories) > 0) / COUNT(*) as open_access_ratio,
                COUNTIF(ARRAY_LENGTH(repository_dois) > 0) / COUNT(*) as data_sharing_ratio,
                -- Field distribution
                STRING_AGG(DISTINCT categories.for_2020_v2022.first_level.full[SAFE_OFFSET(0)].name, ', ') as field_distribution,
                -- Top journals
                STRING_AGG(DISTINCT journal.title ORDER BY journal.title LIMIT 5) as top_journals,
                -- Funding success
                COUNT(DISTINCT funding_details.grant_id) as total_grants,
                COUNT(DISTINCT funding_details.grid_id) as unique_funders
            FROM `{self.bq.datasets[dataset_name].full_path}`,
            UNNEST(funding_details) as funding_details
            WHERE {self.build_where_clause(filters)}
            GROUP BY year
            ORDER BY year DESC
        )
        SELECT * FROM impact_metrics
        """
        return self.execute_query(dataset_name, query)