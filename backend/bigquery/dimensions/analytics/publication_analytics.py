from typing import Dict, Any
import pandas as pd
from ..DimensionsFilter import DimensionsFilter

class PublicationAnalytics(DimensionsFilter):
    def analyze(self, dataset_name: str, filters: Dict[str, Any]) -> pd.DataFrame:
        """
        Analyze publication venues and patterns with improved NULL handling 
        and date range filtering.
        """
        query = f"""
        WITH filtered_pubs AS (
            SELECT *
            FROM {self.bq.datasets[dataset_name].full_path}
            WHERE {self.build_where_clause(filters)} 
          
        ),
        journal_metrics AS (
            SELECT 
                EXTRACT(YEAR from date_normal) as year,
                source.title as journal_name,
                COALESCE(publisher.name, 'Unknown Publisher') as publisher_name,
                COUNT(*) as publication_count,
                COUNTIF(ARRAY_LENGTH(COALESCE(open_access_categories, [])) > 0) as open_access_count,
                ROUND(SAFE_DIVIDE(
                    COUNTIF(ARRAY_LENGTH(COALESCE(open_access_categories, [])) > 0),
                    COUNT(*)
                ), 3) as open_access_ratio,
                COUNTIF(ARRAY_LENGTH(COALESCE(repository_dois, [])) > 0) as papers_with_data,
                ROUND(AVG(COALESCE(citations_count, 0)), 2) as avg_citations,
                ROUND(AVG(COALESCE(metrics.field_citation_ratio, 0)), 2) as avg_field_citation_ratio,
                MIN(date_normal) as first_publication,
                MAX(date_normal) as last_publication
            FROM filtered_pubs
            GROUP BY 
                EXTRACT(YEAR from date_normal),
                source.title,
                publisher.name

            ORDER BY publication_count DESC
           
        )
        SELECT 
            *,
            ROUND(DATE_DIFF(last_publication, first_publication, DAY) / 365, 2) as publication_span_years
        FROM journal_metrics
        WHERE year IS NOT NULL 
        ORDER BY year DESC, publication_count DESC
        """
        return self.execute_query(dataset_name, query)
    
    def get_publications(self, dataset_name: str, filters: Dict[str, Any]) -> pd.DataFrame:
        """
        Get paginated publication data from Dimensions including proper author information.
        
        Args:
            dataset_name: Name of the dataset to query
            filters: Dictionary containing filters including page and per_page
        
        Returns:
            DataFrame containing publication data and total count
        """
        page = filters.pop('page', 1)
        per_page = filters.pop('per_page', 10)
        offset = (page - 1) * per_page
        
        query = f"""
        WITH filtered_pubs AS (
            SELECT 
                id,
                title.preferred as title,
                date_normal,
                document_type.classification as document_type,
                COALESCE(citations_count, 0) as citations_count,
                doi,
                ARRAY(
                    SELECT AS STRUCT 
                        STRUCT(
                            first_name as first_name,
                            last_name as last_name
                        ) as author
                    FROM UNNEST(authors)
                ) as authors,
                COUNT(*) OVER() as total_count
            FROM {self.bq.datasets[dataset_name].full_path}
            WHERE date_normal IS NOT NULL
            {' AND ' + self.build_where_clause(filters) if filters else ''}
        )
        
        SELECT *
        FROM filtered_pubs
        ORDER BY date_normal DESC
        LIMIT {per_page}
        OFFSET {offset}
        """
        
        return self.execute_query(dataset_name, query)




    def get_basic_stats(self, dataset_name: str, filters: Dict[str, Any]) -> pd.DataFrame:
        query = f"""
WITH filtered_pubs AS (
    SELECT
        EXTRACT(YEAR FROM date_normal) as pub_year,
        document_type.classification as doc_type,
        COALESCE(citations_count, 0) as citations_count,
        COALESCE(metrics.field_citation_ratio, 0) as field_citation_ratio,
        COALESCE(metrics.relative_citation_ratio, 0) as relative_citation_ratio,
        COALESCE(metrics.recent_citations, 0) as recent_citations,
        COALESCE(altmetrics.score, 0) as altmetric_score,
        concepts,
        pubmed.mesh.terms as mesh_terms,
        categories.sdg_v2021.full as sdg_categories,
        ARRAY_LENGTH(COALESCE(research_orgs, [])) as collaboration_count,
        ARRAY_LENGTH(COALESCE(research_org_countries, [])) as international_collaboration_count,
        ARRAY_LENGTH(COALESCE(authors, [])) as author_count,
        ARRAY_LENGTH(COALESCE(citations, [])) as citation_references_count,
        ARRAY_LENGTH(COALESCE(clinical_trial_ids, [])) as clinical_trials_count,
        ARRAY_LENGTH(COALESCE(patent_ids, [])) as patent_count,
        ARRAY_LENGTH(COALESCE(funding_details, [])) as funding_count,
        ARRAY_LENGTH(COALESCE(repository_dois, [])) as repository_count,
        open_access_categories,
        research_org_countries,
        date_normal,
        research_orgs,
        funder_orgs,
        authors,
        source,
        title,
        publisher
    FROM {self.bq.datasets[dataset_name].full_path}
    WHERE {self.build_where_clause(filters)}
),

doc_type_stats AS (
    SELECT
        pub_year,
        ARRAY_AGG(STRUCT(doc_type, doc_count) ORDER BY doc_count DESC) AS doc_types
    FROM (
        SELECT
            pub_year,
            doc_type,
            COUNT(*) AS doc_count
        FROM filtered_pubs
        WHERE pub_year IS NOT NULL
        GROUP BY pub_year, doc_type
    )
    GROUP BY pub_year
),

concept_stats AS (
    SELECT
        pub_year,
        ARRAY_AGG(STRUCT(concept_text, concept_count) ORDER BY concept_count DESC LIMIT 200) AS concepts
    FROM (
        SELECT 
            p.pub_year,
            concept.concept AS concept_text,
            COUNT(*) AS concept_count
        FROM filtered_pubs p,
        UNNEST(concepts) AS concept
        WHERE concept.concept IS NOT NULL
        GROUP BY pub_year, concept.concept
    )
    GROUP BY pub_year
),

mesh_stats AS (
    SELECT
        pub_year,
        ARRAY_AGG(STRUCT(term, term_count) ORDER BY term_count DESC LIMIT 100) AS terms
    FROM (
        SELECT 
            p.pub_year,
            term,
            COUNT(*) AS term_count
        FROM filtered_pubs p,
        UNNEST(mesh_terms) AS term
        WHERE term IS NOT NULL
        GROUP BY pub_year, term
    )
    GROUP BY pub_year
),

sdg_stats AS (
    SELECT
        pub_year,
        ARRAY_AGG(STRUCT(code, name, sdg_count) ORDER BY sdg_count DESC LIMIT 17) AS sdgs
    FROM (
        SELECT 
            p.pub_year,
            sdg.code AS code,
            sdg.name AS name,
            COUNT(*) AS sdg_count
        FROM filtered_pubs p,
        UNNEST(sdg_categories) AS sdg
        WHERE sdg.code IS NOT NULL
        GROUP BY pub_year, sdg.code, sdg.name
    )
    GROUP BY pub_year
),

country_stats AS (
    SELECT
        pub_year,
        ARRAY_AGG(STRUCT(country, count) ORDER BY count DESC LIMIT 20) AS countries
    FROM (
        SELECT 
            p.pub_year,
            country,
            COUNT(*) as count
        FROM filtered_pubs p,
        UNNEST(research_org_countries) as country
        WHERE country IS NOT NULL
        GROUP BY pub_year, country
    )
    GROUP BY pub_year
),

institution_stats AS (
    SELECT
        pub_year,
        ARRAY_AGG(STRUCT(org, count) ORDER BY count DESC LIMIT 20) AS institutions
    FROM (
        SELECT 
            p.pub_year,
            org,
            COUNT(*) as count
        FROM filtered_pubs p,
        UNNEST(research_orgs) as org
        WHERE org IS NOT NULL
        GROUP BY pub_year, org
    )
    GROUP BY pub_year
),

journal_stats AS (
    SELECT
        pub_year,
        ARRAY_AGG(STRUCT(title as journal, count) ORDER BY count DESC LIMIT 20) AS journals
    FROM (
        SELECT 
            p.pub_year,
            source.title as title,
            COUNT(*) as count
        FROM filtered_pubs p
        WHERE source.title IS NOT NULL
        GROUP BY pub_year, source.title
    )
    GROUP BY pub_year
),

author_stats AS (
    SELECT
        pub_year,
        ARRAY_AGG(STRUCT(author_name as author, count) ORDER BY count DESC LIMIT 20) AS authors
    FROM (
        SELECT 
            p.pub_year,
            CONCAT(author.first_name, ' ', author.last_name) as author_name,
            COUNT(*) as count
        FROM filtered_pubs p,
        UNNEST(authors) as author
        GROUP BY pub_year, author_name
    )
    GROUP BY pub_year
),

oa_stats AS (
    SELECT
        pub_year,
        ARRAY_AGG(STRUCT(cat as category, count) ORDER BY count DESC LIMIT 20) AS categories
    FROM (
        SELECT 
            p.pub_year,
            cat,
            COUNT(*) as count
        FROM filtered_pubs p,
        UNNEST(open_access_categories) as cat
        WHERE cat IS NOT NULL
        GROUP BY pub_year, cat
    )
    GROUP BY pub_year
),

funder_stats AS (
    SELECT
        pub_year,
        ARRAY_AGG(STRUCT(funder, count) ORDER BY count DESC LIMIT 20) AS funders
    FROM (
        SELECT 
            p.pub_year,
            funder,
            COUNT(*) as count
        FROM filtered_pubs p,
        UNNEST(funder_orgs) as funder
        WHERE funder IS NOT NULL
        GROUP BY pub_year, funder
    )
    GROUP BY pub_year
),

publisher_stats AS (
    SELECT
        pub_year,
        ARRAY_AGG(STRUCT(name as publisher, count) ORDER BY count DESC LIMIT 20) AS publishers
    FROM (
        SELECT 
            p.pub_year,
            publisher.name,
            COUNT(*) as count
        FROM filtered_pubs p
        WHERE publisher.name IS NOT NULL
        GROUP BY pub_year, publisher.name
    )
    GROUP BY pub_year
),

yearly_stats AS (
    SELECT
        f.pub_year AS year, 
        COUNT(*) AS total_publications,
        COUNTIF(doc_type = 'RESEARCH_ARTICLE') AS research_article_count,
        COUNTIF(doc_type = 'REVIEW_ARTICLE') AS review_article_count,
        COUNTIF(doc_type = 'RESEARCH_CHAPTER') AS research_chapter_count,
        COUNTIF(doc_type = 'CONFERENCE_PAPER') AS conference_paper_count,
        COUNTIF(doc_type = 'REFERENCE_WORK') AS reference_work_count,
        COUNTIF(doc_type = 'EDITORIAL') AS editorial_count,
        COUNTIF(doc_type = 'OTHER_JOURNAL_CONTENT') AS other_journal_count,
        COUNTIF(doc_type = 'LETTER_TO_EDITOR') AS letter_to_editor_count,
        COUNTIF(doc_type = 'OTHER_BOOK_CONTENT') AS book_count,
        COUNTIF(doc_type = 'BOOK_REVIEW') AS book_review_count,
        COUNTIF(doc_type = 'OTHER_CONFERENCE_CONTENT') AS other_conference_count,

        ROUND(AVG(citations_count), 2) AS avg_citations,
        ROUND(AVG(recent_citations), 2) AS avg_recent_citations,
        ROUND(AVG(field_citation_ratio), 3) AS avg_field_citation_ratio,
        ROUND(AVG(relative_citation_ratio), 3) AS avg_relative_citation_ratio,
        COUNTIF(field_citation_ratio > 1) AS above_field_average_count,
        ROUND(SAFE_DIVIDE(COUNTIF(field_citation_ratio > 1), COUNT(*)), 3) AS above_field_average_ratio,
        ROUND(AVG(altmetric_score), 2) AS avg_altmetric_score,
        ROUND(AVG(collaboration_count), 2) AS avg_collaborating_institutions,
        ROUND(AVG(international_collaboration_count), 2) AS avg_collaborating_countries,

        ROUND(AVG(author_count), 2) AS avg_authors_per_publication,
        ROUND(AVG(citation_references_count), 2) AS avg_references_per_publication,
        SUM(clinical_trials_count) AS total_clinical_trials,
        SUM(patent_count) AS total_patents,
        SUM(funding_count) AS total_funding_instances,
        SUM(repository_count) AS total_repository_deposits,
        COUNTIF(ARRAY_LENGTH(open_access_categories) > 0) AS open_access_count,
        ROUND(SAFE_DIVIDE(COUNTIF(ARRAY_LENGTH(open_access_categories) > 0), COUNT(*)), 3) AS open_access_ratio,
        (SELECT COUNT(DISTINCT country) 
         FROM filtered_pubs fp,
         UNNEST(research_org_countries) as country
         WHERE fp.pub_year = f.pub_year) AS unique_countries_count,
        COUNT(DISTINCT FORMAT_DATE('%m', date_normal)) AS months_with_publications,

        -- Order these consistently with all_years_stats
        d.doc_types AS doc_type_counts,
        c.concepts AS top_concepts,
        m.terms AS top_mesh_terms,
        s.sdgs AS sdg_categories,
        co.countries as top_countries,
        i.institutions as top_collaborating_institutions,
        j.journals as top_journals,
        a.authors as top_authors,
        o.categories as open_access_types,
        fu.funders as top_funders,
        pu.publishers as top_publishers
        
    FROM filtered_pubs f
    LEFT JOIN doc_type_stats d ON f.pub_year = d.pub_year
    LEFT JOIN concept_stats c ON f.pub_year = c.pub_year
    LEFT JOIN mesh_stats m ON f.pub_year = m.pub_year
    LEFT JOIN sdg_stats s ON f.pub_year = s.pub_year
    LEFT JOIN country_stats co ON f.pub_year = co.pub_year
    LEFT JOIN institution_stats i ON f.pub_year = i.pub_year
    LEFT JOIN journal_stats j ON f.pub_year = j.pub_year
    LEFT JOIN author_stats a ON f.pub_year = a.pub_year
    LEFT JOIN oa_stats o ON f.pub_year = o.pub_year
    LEFT JOIN funder_stats fu ON f.pub_year = fu.pub_year
    LEFT JOIN publisher_stats pu ON f.pub_year = pu.pub_year
    GROUP BY 
        f.pub_year,
        d.doc_types,
        c.concepts,
        m.terms,
        s.sdgs,
        co.countries,
        i.institutions,
        j.journals,
        a.authors,
        o.categories,
        fu.funders,
        pu.publishers
    HAVING year IS NOT NULL
    ORDER BY year DESC
),

all_years_stats AS (
    SELECT
        9999 AS year,
        COUNT(*) AS total_publications,
        COUNTIF(doc_type = 'RESEARCH_ARTICLE') AS research_article_count,
        COUNTIF(doc_type = 'REVIEW_ARTICLE') AS review_article_count,
        COUNTIF(doc_type = 'RESEARCH_CHAPTER') AS research_chapter_count,
        COUNTIF(doc_type = 'CONFERENCE_PAPER') AS conference_paper_count,
        COUNTIF(doc_type = 'REFERENCE_WORK') AS reference_work_count,
        COUNTIF(doc_type = 'EDITORIAL') AS editorial_count,
        COUNTIF(doc_type = 'OTHER_JOURNAL_CONTENT') AS other_journal_count,
        COUNTIF(doc_type = 'LETTER_TO_EDITOR') AS letter_to_editor_count,
        COUNTIF(doc_type = 'OTHER_BOOK_CONTENT') AS book_count,
        COUNTIF(doc_type = 'BOOK_REVIEW') AS book_review_count,
        COUNTIF(doc_type = 'OTHER_CONFERENCE_CONTENT') AS other_conference_count,

        ROUND(AVG(citations_count), 2) AS avg_citations,
        ROUND(AVG(recent_citations), 2) AS avg_recent_citations,
        ROUND(AVG(field_citation_ratio), 3) AS avg_field_citation_ratio,
        ROUND(AVG(relative_citation_ratio), 3) AS avg_relative_citation_ratio,
        COUNTIF(field_citation_ratio > 1) AS above_field_average_count,
        ROUND(SAFE_DIVIDE(COUNTIF(field_citation_ratio > 1), COUNT(*)), 3) AS above_field_average_ratio,
        ROUND(AVG(altmetric_score), 2) AS avg_altmetric_score,
        ROUND(AVG(collaboration_count), 2) AS avg_collaborating_institutions,
        ROUND(AVG(international_collaboration_count), 2) AS avg_collaborating_countries,

        ROUND(AVG(author_count), 2) AS avg_authors_per_publication,
        ROUND(AVG(citation_references_count), 2) AS avg_references_per_publication,
        SUM(clinical_trials_count) AS total_clinical_trials,
        SUM(patent_count) AS total_patents,
        SUM(funding_count) AS total_funding_instances,
        SUM(repository_count) AS total_repository_deposits,
        COUNTIF(ARRAY_LENGTH(open_access_categories) > 0) AS open_access_count,
        ROUND(SAFE_DIVIDE(COUNTIF(ARRAY_LENGTH(open_access_categories) > 0), COUNT(*)), 3) AS open_access_ratio,
        (SELECT COUNT(DISTINCT country) 
         FROM filtered_pubs fp,
         UNNEST(research_org_countries) as country) AS unique_countries_count,
        COUNT(DISTINCT FORMAT_DATE('%m', date_normal)) AS months_with_publications,

        -- Order these consistently with yearly_stats
        (SELECT ARRAY_AGG(STRUCT(doc_type, doc_count) ORDER BY doc_count DESC)
         FROM (
             SELECT doc_type, COUNT(*) AS doc_count
             FROM filtered_pubs
             GROUP BY doc_type
         )
        ) AS doc_type_counts,
        
        (SELECT ARRAY_AGG(STRUCT(concept_text, concept_count) ORDER BY concept_count DESC LIMIT 200)
         FROM (
             SELECT concept.concept AS concept_text, COUNT(*) AS concept_count
             FROM filtered_pubs p, 
             UNNEST(concepts) AS concept
             WHERE concept.concept IS NOT NULL
             GROUP BY concept.concept
         )
        ) AS top_concepts,
        
        (SELECT ARRAY_AGG(STRUCT(term, term_count) ORDER BY term_count DESC LIMIT 100)
         FROM (
             SELECT term, COUNT(*) AS term_count
             FROM filtered_pubs p, 
             UNNEST(mesh_terms) AS term
             WHERE term IS NOT NULL
             GROUP BY term
         )
        ) AS top_mesh_terms,
        
        (SELECT ARRAY_AGG(STRUCT(code, name, sdg_count) ORDER BY sdg_count DESC LIMIT 17)
         FROM (
             SELECT sdg.code AS code, sdg.name AS name, COUNT(*) AS sdg_count
             FROM filtered_pubs p, 
             UNNEST(sdg_categories) AS sdg
             WHERE sdg.code IS NOT NULL
             GROUP BY sdg.code, sdg.name
         )
        ) AS sdg_categories,
        
        (SELECT ARRAY_AGG(STRUCT(country, count) ORDER BY count DESC LIMIT 20)
         FROM (
             SELECT country, COUNT(*) as count
             FROM filtered_pubs p,
             UNNEST(research_org_countries) as country
             WHERE country IS NOT NULL
             GROUP BY country
         )
        ) AS top_countries,

        (SELECT ARRAY_AGG(STRUCT(org, count) ORDER BY count DESC LIMIT 20)
         FROM (
             SELECT org, COUNT(*) as count
             FROM filtered_pubs p,
             UNNEST(research_orgs) as org
             WHERE org IS NOT NULL
             GROUP BY org
         )
        ) AS top_collaborating_institutions,

        (SELECT ARRAY_AGG(STRUCT(title as journal, count) ORDER BY count DESC LIMIT 20)
         FROM (
             SELECT source.title as title, COUNT(*) as count
             FROM filtered_pubs p
             WHERE source.title IS NOT NULL
             GROUP BY source.title
         )
        ) AS top_journals,

        (SELECT ARRAY_AGG(STRUCT(author_name as author, count) ORDER BY count DESC LIMIT 20)
         FROM (
             SELECT CONCAT(author.first_name, ' ', author.last_name) as author_name,
                    COUNT(*) as count
             FROM filtered_pubs p,
             UNNEST(authors) as author
             GROUP BY author_name
         )
        ) AS top_authors,

        (SELECT ARRAY_AGG(STRUCT(cat as category, count) ORDER BY count DESC LIMIT 20)
         FROM (
             SELECT cat, COUNT(*) as count
             FROM filtered_pubs p,
             UNNEST(open_access_categories) as cat
             WHERE cat IS NOT NULL
             GROUP BY cat
         )
        ) AS open_access_types,

        (SELECT ARRAY_AGG(STRUCT(funder, count) ORDER BY count DESC LIMIT 20)
         FROM (
             SELECT funder, COUNT(*) as count
             FROM filtered_pubs p,
             UNNEST(funder_orgs) as funder
             WHERE funder IS NOT NULL
             GROUP BY funder
         )
        ) AS top_funders,

        (SELECT ARRAY_AGG(STRUCT(name as publisher, count) ORDER BY count DESC LIMIT 20)
         FROM (
             SELECT publisher.name, COUNT(*) as count
             FROM filtered_pubs p
             WHERE publisher.name IS NOT NULL
             GROUP BY publisher.name
         )
        ) AS top_publishers
    FROM filtered_pubs f
)

SELECT * FROM yearly_stats
UNION ALL
SELECT * FROM all_years_stats
        """
        return self.execute_query(dataset_name, query)