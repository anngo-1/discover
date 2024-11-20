from google.cloud import bigquery
from dataclasses import dataclass
from typing import Optional, Union, Dict, List
import pandas as pd

@dataclass
class Dataset:
    """Dataset configuration"""
    project_id: str
    dataset: str
    table: str
    billing_project_id: str

    @property
    def full_path(self) -> str:
        return f"{self.project_id}.{self.dataset}.{self.table}"

class BigQuery:
    def __init__(self):
        self.clients: Dict[str, bigquery.Client] = {}
        self.datasets: Dict[str, Dataset] = {}

    def add_dataset(
        self,
        name: str,
        project_id: str,
        dataset: str,
        table: str,
        billing_project_id: str
    ):
        """Register a new dataset"""
        self.datasets[name] = Dataset(project_id, dataset, table, billing_project_id)
        if billing_project_id not in self.clients:
            self.clients[billing_project_id] = bigquery.Client(project=billing_project_id)

    def get_data(
        self,
        dataset_name: str,
        fields: List[str],
        where: Optional[str] = None,
        limit: Optional[int] = None,
        as_dataframe: bool = True
    ) -> Union[pd.DataFrame, bigquery.table.RowIterator]:
        """Retrieve data from a specific dataset with optional filtering and limiting"""
        dataset = self.datasets[dataset_name]
        
        # build the SELECT clause
        select_clause = ", ".join(fields)
        
        # build the base query
        query = f"SELECT {select_clause} FROM `{dataset.full_path}`"
        
        if where:
            query += f" WHERE {where}"
            
        if limit:
            query += f" LIMIT {limit}"
            
        return self.query(dataset_name, query, as_dataframe)

    def query(
        self,
        dataset_name: str,
        query: str,
        as_dataframe: bool = True
    ) -> Union[pd.DataFrame, bigquery.table.RowIterator]:
        """Run a query against a specific dataset"""
        dataset = self.datasets[dataset_name]
        client = self.clients[dataset.billing_project_id]
        
        try:
            results = client.query(query).result()
            return results.to_dataframe() if as_dataframe else results
        except Exception as e:
            raise Exception(f"Query failed: {str(e)}\nQuery: {query}")

# example usage
def main():
    # initialize client
    bq = BigQuery()
    
    # add dataset with separate billing project
    bq.add_dataset(
        name='publications',
        project_id='covid-19-dimensions-ai',  # using dimensions example covid dataset
        dataset='data',
        table='publications',
        billing_project_id='ucsd-discover'  # project id for billing (currently my personal one)
    )
    
    # data retrieval example
    recent_pubs = bq.get_data(
        dataset_name='publications',
        fields=['title', 'date_normal', 'citations_count'],
        where="date_normal >= '2023-01-01'",
        limit=100
    )
    print(recent_pubs)

if __name__ == "__main__":
    main()