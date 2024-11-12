import json
from flask import jsonify, request
import requests
from utils import INSTITUTION_ID
from utils.date_utils import determine_scale, generate_filters
from utils.metrics_utils import fetch_groupings, fetch_metrics, transform_group_data, transform_open_access_data
from utils.works_filter import generate_filter_strings
from . import work_data_bp

@work_data_bp.route('/group_metrics', methods=['GET'])
def fetch_groupings_endpoint():
    """
    Fetches group metrics (funders, publishers, open access) based on a filter.
    Returns the results in a flat structure.
    """
    try:
        filter = json.loads(request.args.get('filter', '{}'))
        filter_string = generate_filter_strings(filter)['filter']

        # base parameters for the API request
        base_params = {
            'mailto': 'dn007@ucsd.edu',
            'filter': f'authorships.institutions.id:{INSTITUTION_ID},{filter_string}'
        }

        # define the groupings to fetch from the OpenAlex API
        groupings = {
            'funders': 'grants.funder',
            'publishers': 'primary_location.source.publisher_lineage',
            'open_access': 'open_access.is_oa'
        }

        # fetch groupings in parallel 
        group_results = fetch_groupings(base_params, groupings)

        # flatten results for frontend parsing
        transformed_results = {
            'funders': transform_group_data(group_results.get('funders', {}), 'grants.funder'),
            'publishers': transform_group_data(group_results.get('publishers', {}), 'primary_location.source.publisher_lineage'),
            'open_access': transform_open_access_data(group_results.get('open_access', {}), 'open_access.is_oa')
        }
        return jsonify(transformed_results)

    except requests.exceptions.RequestException as e:
        return jsonify({'error': f'API request failed: {str(e)}'}), 500


@work_data_bp.route('/works_metrics', methods=['GET'])
def get_works_metrics():
    """
    Given a filter, determines an appropriate time scale and fetches citation count, counts of types of work, and works count over each time step.
    Is used to generate data for charts on frontend.
    Returns:
        Time series data on citation counts over time, counts of work over time, and the number of types over time. 
    """
    try:
        filter = json.loads(request.args.get('filter', '{}'))
        filter_string = generate_filter_strings(filter)['filter']

        # figure out scale to display chart 
        date_from = filter.get('dateRange', {}).get('from', "")
        date_to = filter.get('dateRange', {}).get('to', "")
        scale = determine_scale(date_from, date_to, filter.get('scale'))  

        # generate the time filters (either quarterly or yearly), based on scale determined
        time_filters = generate_filters(date_from, date_to, scale)

        base_params = {
            'mailto': 'dn007@ucsd.edu',
            'filter': f'authorships.institutions.id:{INSTITUTION_ID},{filter_string}'
        }

        results = {
            'timeline': [],
            'scale': scale,
        }

        # get metrics for each time period
        count = 0
        for time_filter in time_filters:
            count+=1
            print(f"api call{count}")
            period_filter = {
                **base_params,
                'filter': f"{base_params['filter']},from_publication_date:{time_filter['from']},to_publication_date:{time_filter['to']}"
            }
            period_metrics = fetch_metrics(period_filter, group_by='type')  
            results['timeline'].append({
                'period': time_filter['display'] if 'display' in time_filter else time_filter['from'][:4],
                **period_metrics['basic'],
                'types': period_metrics['type']
            })

        # sort the timeline in ascending order by period (years) (2022, 2023, 2024, etc.).
        results['timeline'].sort(key=lambda x: x['period'], reverse=False)

        return jsonify(results)

    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500