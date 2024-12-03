from typing import Dict, Any
import pandas as pd
from ..DimensionsFilter import DimensionsFilter

class CollaborationAnalytics(DimensionsFilter):
    def analyze(self, dataset_name: str, filters: Dict[str, Any]) -> pd.DataFrame:
        """Analyze collaboration networks and patterns"""
        query = f"""
        WITH base_collaborations AS (
            SELECT 
                year,
                org,
                country_name,
                id,
                citations_count,
                metrics.field_citation_ratio,
                categories.for_2020_v2022.first_level.full[SAFE_OFFSET(0)].name as field_name,
                ARRAY_LENGTH(open_access_categories) > 0 as is_open_access,
                ARRAY_LENGTH(repository_dois) > 0 as has_data
            FROM `{self.bq.datasets[dataset_name].full_path}`,
            UNNEST(research_orgs) as org,
            UNNEST(research_org_country_names) as country_name
            WHERE {self.build_where_clause(filters)}
            AND org != 'grid.266100.3'  -- Exclude self-collaboration
        ),
        collaboration_metrics AS (
            SELECT 
                year,
                org as collaborator_institution,
                country_name as collaborator_country,
                COUNT(DISTINCT id) as publication_count,
                AVG(citations_count) as avg_citations,
                AVG(field_citation_ratio) as field_weighted_impact,
                COUNT(DISTINCT field_name) as research_fields,
                STRING_AGG(DISTINCT field_name, ', ') as field_names,
                COUNTIF(is_open_access) as open_access_count,
                COUNTIF(has_data) as papers_with_data
            FROM base_collaborations
            GROUP BY year, org, country_name
            HAVING publication_count >= 3
        )
        SELECT *
        FROM collaboration_metrics
        WHERE year >= 2020
        ORDER BY year DESC, publication_count DESC
        LIMIT 500
        """
        return self.execute_query(dataset_name, query)