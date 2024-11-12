from concurrent.futures import ThreadPoolExecutor
import requests
from utils import OPENALEX_API_URL

def transform_group_data(group_data, key):
    return {
        item['name']: item['count']
        for item in group_data.get(key, [])
        if item['name'] is not None
    }

# Helper function to transform open access data with a custom label
def transform_open_access_data(group_data, key):
    return {
        'Open Access' if item['name'] == 'true' else 'Closed Access': item['count']
        for item in group_data.get(key, [])
        if item['name'] is not None
    }

def fetch_metrics(base_params, group_by=None):
    try:
        metrics = {}

        response = requests.get(
            OPENALEX_API_URL,
            params={**base_params, 'select': 'id', 'cited_by_count_sum': 'true'}
        )
        response.raise_for_status()  

        data = response.json()

        if 'meta' not in data:
            raise ValueError("Missing 'meta' data in API response.")

        total_count = data['meta'].get('count', 0)
        cited_by_count = data['meta'].get('cited_by_count_sum', 0)

        avg_citation = round(cited_by_count / total_count, 1) if total_count > 0 else 0

        metrics['basic'] = {
            'total': total_count,
            'cited_by_count': cited_by_count,
            'avg_citation': avg_citation
        }

        if group_by:
            response = requests.get(
                OPENALEX_API_URL,
                params={**base_params, 'group_by': group_by}
            )
            response.raise_for_status()
            data = response.json()


            if 'group_by' not in data:
                raise ValueError(f"Missing 'group_by' data in API response for group_by: {group_by}")

            metrics[group_by] = [
                {
                    'name': group.get('key_display_name', str(group.get('key', 'Unknown'))),
                    'count': group.get('count', 0)
                }
                for group in data.get('group_by', [])
                if group.get('key') is not None
            ]

        return metrics

    except requests.exceptions.RequestException as e:
        print(f"Error in fetch_metrics: {str(e)}")
        raise
    except ValueError as ve:
        print(f"ValueError: {str(ve)}")
        raise
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        raise
    
def fetch_groupings(base_params, groupings):
    results = {}
    
    for group_name, group_by in groupings.items():
        # Fetch the metrics for each group one by one
        result = fetch_metrics(base_params, group_by=group_by)
        results[group_name] = result
    
    return results

