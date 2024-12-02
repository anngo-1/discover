from typing import Dict, Any
import pandas as pd
from datetime import datetime

class DimensionsFilter:
    def __init__(self, bq_client):
        self.bq = bq_client
        
    def build_where_clause(self, filters: Dict[str, Any]) -> str:
        conditions = []
        
        conditions.append("date_normal IS NOT NULL")

        if filters.get('dateRange'):
            if filters['dateRange'].get('from'):
                from_date = self._format_date(filters['dateRange']['from'])
                if from_date:
                    conditions.append(f"DATE(date_normal) >= DATE('{from_date}')")
            if filters['dateRange'].get('to'):
                to_date = self._format_date(filters['dateRange']['to'])
                if to_date:
                    conditions.append(f"DATE(date_normal) <= DATE('{to_date}')")


        if filters.get('search_query'):
            search_terms = filters['search_query'].replace("'", "''")
            conditions.append(f"""(
                LOWER(title.preferred) LIKE LOWER('%{search_terms}%') OR
                LOWER(COALESCE(abstract.preferred, '')) LIKE LOWER('%{search_terms}%')
            )""")

        if filters.get('citationCount'):
            if filters['citationCount'].get('min') is not None:
                conditions.append(f"COALESCE(citations_count, 0) >= {filters['citationCount']['min']}")
            if filters['citationCount'].get('max') is not None:
                conditions.append(f"citations_count <= {filters['citationCount']['max']}")

        if filters.get('type') and len(filters['type']) > 0:
            doc_types = [f"'{t}'" for t in filters['type']]
            conditions.append(f"document_type.classification IN ({','.join(doc_types)})")

        if filters.get('fields') and len(filters['fields']) > 0:
            field_conditions = []
            for field in filters['fields']:
                field = field.replace("'", "''")
                field_conditions.append(f"""
                    EXISTS (
                        SELECT 1 
                        FROM UNNEST(categories.for_2020_v2022.first_level.full) f
                        WHERE LOWER(f.name) = LOWER('{field}')
                    )
                """)
            if field_conditions:
                conditions.append(f"({' OR '.join(field_conditions)})")

        if filters.get('excludeFields') and len(filters['excludeFields']) > 0:
            for field in filters['excludeFields']:
                field = field.replace("'", "''")
                conditions.append(f"""
                    NOT EXISTS (
                        SELECT 1 
                        FROM UNNEST(categories.for_2020_v2022.first_level.full) f
                        WHERE LOWER(f.name) = LOWER('{field}')
                    )
                """)

        if filters.get('organizations'):
            if filters['organizations'].get('research') and len(filters['organizations']['research']) > 0:
                research_orgs = [f"'{org}'" for org in filters['organizations']['research']]
                conditions.append(f"""
                    EXISTS (
                        SELECT 1 
                        FROM UNNEST(research_orgs) org_array
                        WHERE org_array IN ({','.join(research_orgs)})
                    )
                """)
            if filters['organizations'].get('funding') and len(filters['organizations']['funding']) > 0:
                funding_orgs = [f"'{org}'" for org in filters['organizations']['funding']]
                conditions.append(f"""
                    EXISTS (
                        SELECT 1 
                        FROM UNNEST(funder_orgs) org_array
                        WHERE org_array IN ({','.join(funding_orgs)})
                    )
                """)

        if filters.get('journalLists') and len(filters['journalLists']) > 0:
            journal_lists = [f"'{jl}'" for jl in filters['journalLists']]
            conditions.append(f"""
                EXISTS (
                    SELECT 1 
                    FROM UNNEST(journal_lists) jl
                    WHERE jl IN ({','.join(journal_lists)})
                )
            """)

        if filters.get('openAccess'):
            conditions.append("""
                (ARRAY_LENGTH(COALESCE(open_access_categories, [])) > 0 OR 
                ARRAY_LENGTH(COALESCE(open_access_categories_v2, [])) > 0)
            """)

        if filters.get('has_doi'):
            conditions.append("doi IS NOT NULL")

        if filters.get('publisherFilters'):
            if filters['publisherFilters'].get('publishers') and len(filters['publisherFilters']['publishers']) > 0:
                publishers = [f"'{p}'" for p in filters['publisherFilters']['publishers']]
                conditions.append(f"publisher.name IN ({','.join(publishers)})")
            if filters['publisherFilters'].get('excludePublishers') and len(filters['publisherFilters']['excludePublishers']) > 0:
                exclude_publishers = [f"'{p}'" for p in filters['publisherFilters']['excludePublishers']]
                conditions.append(f"publisher.name NOT IN ({','.join(exclude_publishers)})")

        if filters.get('documentTypes'):
            if filters['documentTypes'].get('include') and len(filters['documentTypes']['include']) > 0:
                doc_types = [f"'{dt}'" for dt in filters['documentTypes']['include']]
                conditions.append(f"document_type.classification IN ({','.join(doc_types)})")
            if filters['documentTypes'].get('exclude') and len(filters['documentTypes']['exclude']) > 0:
                exclude_types = [f"'{dt}'" for dt in filters['documentTypes']['exclude']]
                conditions.append(f"document_type.classification NOT IN ({','.join(exclude_types)})")

        # preprint handling 
        if filters.get('preprints'):
            if filters['preprints'].get('exclude'):
                conditions.append("""
                    (repository_dois IS NULL OR ARRAY_LENGTH(repository_dois) = 0) AND
                    (arxiv_id IS NULL)
                """)
            elif filters['preprints'].get('only'):
                conditions.append("""
                    (repository_dois IS NOT NULL AND ARRAY_LENGTH(repository_dois) > 0) OR
                    arxiv_id IS NOT NULL
                """)

        if filters.get('accessType'):
            access_conditions = []
            if filters['accessType'].get('openAccess'):
                access_conditions.append("ARRAY_LENGTH(COALESCE(open_access_categories, [])) > 0")
            if filters['accessType'].get('subscription'):
                access_conditions.append("ARRAY_LENGTH(COALESCE(open_access_categories, [])) = 0")
            if access_conditions:
                conditions.append(f"({' OR '.join(access_conditions)})")

        if filters.get('subjectAreas') and len(filters['subjectAreas']) > 0:
            subject_conditions = []
            for subject in filters['subjectAreas']:
                subject = subject.replace("'", "''")
                subject_conditions.append(f"""
                    EXISTS (
                        SELECT 1 
                        FROM UNNEST(categories.for_2020_v2022.first_level.full) f
                        WHERE LOWER(f.name) = LOWER('{subject}')
                    )
                """)
            if subject_conditions:
                conditions.append(f"({' OR '.join(subject_conditions)})")
                
        where_clause = " AND ".join(conditions) if conditions else "1=1"
        return where_clause

    def _format_date(self, date_input: Any) -> str:
        """Enhanced date formatter with better error handling"""
        try:
            if isinstance(date_input, str):
                if 'T' in date_input:
                    return date_input.split('T')[0]
                return date_input
                
            if isinstance(date_input, dict):
                if date_input.get('$date'):
                    return self._format_date(date_input['$date'])
                    
            if hasattr(date_input, 'strftime'):
                return date_input.strftime('%Y-%m-%d')
                
            return str(date_input)[:10]
            
        except Exception as e:
            print(f"Date formatting error: {str(e)}")
            print(f"Input: {date_input}, Type: {type(date_input)}")
            return None

    def execute_query(self, dataset_name: str, query: str) -> pd.DataFrame:
        try:
            print(f"\nExecuting query:\n{query}\n")
            result = self.bq.query(dataset_name, query)
            print(f"Query returned {len(result) if result is not None else 0} rows")
            return result
        except Exception as e:
            print(f"Query execution failed: {str(e)}")
            print(f"Query: {query}")
            raise