import json
from flask import jsonify, request
import numpy as np
import pandas as pd
import requests
from . import journal_data_bp
from bigquery.bq import BigQuery
from bigquery.dimensions import DimensionsAnalytics
import datetime
import asyncio


bq = BigQuery()
bq.add_dataset(
    name='publications',
    project_id='ucsd-discover',
    dataset='dimensions',
    table='ucsd_publications',
    billing_project_id='ucsd-discover'
)
analytics = DimensionsAnalytics(bq)

@journal_data_bp.route('/dimensions/journal_stats', methods=['GET'])
def get_journals_stats():
    try:
        filter = json.loads(request.args.get('filter', '{}'))
        result = analytics.publication_analytics.analyze('publications', filter)
        
        if 'publication_count' in result.columns:
            result = result.sort_values('publication_count', ascending=False)
            
        journals_list = []
        for _, row in result.iterrows():
            journal_dict = {}
            for col in result.columns:
                value = row[col]
                # Handle different data types
                if isinstance(value, np.ndarray):
                    journal_dict[col] = value.tolist()
                elif isinstance(value, np.integer):
                    journal_dict[col] = int(value)
                elif isinstance(value, np.floating):
                    journal_dict[col] = float(value)
                elif pd.isna(value):
                    journal_dict[col] = None
                else:
                    journal_dict[col] = value
            journals_list.append(journal_dict)

        return jsonify({
            'status': 'success',
            'data': journals_list,
            'summary': {
                'total_records': len(journals_list),
                'year_range': {
                    'earliest': int(result['year'].min()) if not result.empty else None,
                    'latest': int(result['year'].max()) if not result.empty else None
                }
            },
            'metadata': {'filters_applied': filter}
        })
        
    except Exception as e:
        print(f"Error in get_dimensions_stats: {str(e)}")
        return jsonify({'status': 'error', 'message': str(e)}), 500