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

@work_data_bp.route('/test', methods=['GET'])
def test():
    return("hello world!")


@work_data_bp.route('/publications', methods=['GET'])
def get_publications():
    """
    Middleware between OpenAlex API and frontend. Accepts a filter object as a parameter and builds a filter string to filter 
    and sort a /works API request.
    
    Returns:
        Total count of works filtered, total citations of works filtered, and 10 specific publications, up to 10,000 with pagination.
    """
    try:
        page = request.args.get('page', type=int, default=1)
        filter = json.loads(request.args.get('filter', '{}'))
        filter_dictionary = generate_filter_strings(filter)
        filter_string = filter_dictionary['filter']
        sort_string = filter_dictionary['sort']

        per_page = 10 

        # API call to OpenAlex with the required filters and parameters
        response = requests.get(
            OPENALEX_API_URL,
            params={
                'mailto': 'dn007@ucsd.edu',
                'select': 'id,doi,authorships,title,display_name,publication_date,type,cited_by_count',
                'filter': f'authorships.institutions.id:{INSTITUTION_ID},{filter_string}',
                'sort': f'{sort_string}',
                'page': page,
                'per_page': per_page,
                'cited_by_count_sum': 'true'
            }
        )

        response.raise_for_status() 
        data = response.json()

        # construct the response
        publications = [
            {
                'id': publication['id'],
                'title': publication['title'],
                'cited_by_count': publication['cited_by_count'],
                'doi': publication['doi'],
                'authors': [
                    {'name': authorship['author']['display_name']}
                    for authorship in publication.get('authorships', [])
                ] if publication.get('authorships') else None,
                'publication_date': publication['publication_date'],
                'journal': 'Book' if publication['type'] == 'book' else 'Journal'
            }
            for publication in data['results']
        ]

        # count maximum pagination pages
        total_count = min(data['meta']['count'], 10000)
        total_pages = (total_count // per_page) + (1 if total_count % per_page else 0)

        return jsonify({
            'total_count' :data['meta']['count'],
            'cited_by_count' : data['meta']['cited_by_count_sum'],
            'publications': publications,
            'total_pages': total_pages
        })

    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500