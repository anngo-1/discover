from google.cloud import bigquery
from dataclasses import dataclass
from typing import Optional, Union, Dict
from bq import Dataset, BigQuery
import pandas as pd


bq = BigQuery()

bq.add_dataset(
    name='publications',
    project_id='covid-19-dimensions-ai',
    dataset='data', 
    table='publications',
    billing_project_id='ucsd-discover'
)

# a count query
test_query = """
SELECT COUNT(*) as count
FROM `covid-19-dimensions-ai.data.publications`
"""

results = bq.query('publications', test_query)
print(results)