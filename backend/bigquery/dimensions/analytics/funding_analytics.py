from typing import Dict, Any
import pandas as pd
from ..DimensionsFilter import DimensionsFilter

class FundingAnalytics(DimensionsFilter):
    def analyze(self, dataset_name: str, filters: Dict[str, Any]) -> pd.DataFrame:
        """Analyze funding patterns and impact"""
        query = f"""
        WITH funder_metrics AS (
            SELECT 
                year,
                funding.grid_id,
                COUNT(DISTINCT funding.grant_id) as grant_count,
                COUNT(DISTINCT id) as publication_count,
                AVG(citations_count) as avg_citations,
                AVG(metrics.field_citation_ratio) as field_weighted_impact,
                COUNT(DISTINCT categories.for_2020_v2022.first_level.full[SAFE_OFFSET(0)].name) as research_fields,
                STRING_AGG(DISTINCT categories.for_2020_v2022.first_level.full[SAFE_OFFSET(0)].name, ', ') as field_names,
                COUNTIF(ARRAY_LENGTH(open_access_categories) > 0) as open_access_papers,
                COUNTIF(ARRAY_LENGTH(repository_dois) > 0) as papers_with_data,
                COUNT(DISTINCT ARRAY_TO_STRING(research_org_countries, ',')) as collaborating_countries
            FROM `{self.bq.datasets[dataset_name].full_path}`,
            UNNEST(funding_details) as funding
            WHERE {self.build_where_clause(filters)}
            GROUP BY year, funding.grid_id
            ORDER BY year DESC, publication_count DESC
        )
        SELECT * FROM funder_metrics
        """
        return self.execute_query(dataset_name, query)