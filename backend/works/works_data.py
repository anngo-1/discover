import datetime
from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
from utils import INSTITUTION_ID, OPENALEX_API_URL
from utils.works_filter import generate_filter_strings
from datetime import datetime, timedelta
from concurrent.futures import ThreadPoolExecutor
from . import work_data_bp
import json
from bigquery.bq import BigQuery
from bigquery.dimensions import DimensionsAnalytics
import datetime
import asyncio
import pandas as pd

bq = BigQuery()
bq.add_dataset(
    name='publications',
    project_id='ucsd-discover',
    dataset='dimensions',
    table='ucsd_publications',
    billing_project_id='ucsd-discover'
)
analytics = DimensionsAnalytics(bq)

@work_data_bp.route('/test', methods=['GET'])
def test():
    return("hello world!")



@work_data_bp.route('/dimensions/publications', methods=['GET'])
def get_dimensions_publications():
    """
    Middleware between Dimensions API and frontend. Accepts filter parameters and returns paginated publication data.
    """
    try:
        page = request.args.get('page', type=int, default=1)
        filter_str = request.args.get('filter')
        
        # handle case when no filter is provided
        filter = json.loads(filter_str) if filter_str else {}
        
        per_page = 10
        query_filter = {
            'page': page,
            'per_page': per_page
        }
        if filter:
            query_filter.update(filter)

        result = analytics.publication_analytics.get_publications('publications', query_filter)
        
        if result is None or result.empty:
            return jsonify({
                'total_count': 0,
                'publications': [],
                'total_pages': 0
            })

        total_count = int(result['total_count'].iloc[0])
        total_pages = (total_count // per_page) + (1 if total_count % per_page else 0)

        publications = []
        for _, row in result.iterrows():
            pub = {
                'id': row.get('id'),
                'title': row.get('title'),
                'cited_by_count': int(row['citations_count']) if pd.notnull(row.get('citations_count')) else 0,
                'doi': row.get('doi'),
                'publication_date': row['date_normal'].strftime('%Y-%m-%d') if pd.notnull(row.get('date_normal')) else None,
                'journal': 'Book' if row.get('document_type') == 'book' else 'Journal',
                'authors': []
            }


            authors = row.get('authors')
            if authors is not None and len(authors) > 0:
                pub['authors'] = [
                    {
                        'name': f"{author['author']['first_name']} {author['author']['last_name']}".strip()
                    }
                    for author in authors
                    if isinstance(author, dict) and 
                    isinstance(author.get('author'), dict) and
                    (author['author'].get('first_name') or author['author'].get('last_name'))
                ]

            publications.append(pub)

        return jsonify({
            'total_count': total_count,
            'publications': publications,
            'total_pages': total_pages
        })

    except Exception as e:
        print(f"Error in get_dimensions_publications: {str(e)}")
        print(f"Error details: {type(e).__name__}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
    



