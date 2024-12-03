from google.cloud import bigquery
from dataclasses import dataclass
from typing import Optional, Union, Dict, List, Any
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

    def inspect_schema(self, dataset_name: str) -> None:
        """Print out the schema of a dataset"""
        dataset = self.datasets[dataset_name]
        client = self.clients[dataset.billing_project_id]
        table_ref = client.get_table(dataset.full_path)
        
        print(f"\nSchema for {dataset.full_path}:")
        for field in table_ref.schema:
            print(f"\nField: {field.name}")
            print(f"Type: {field.field_type}")
            print(f"Mode: {field.mode}")
            if field.fields:  # For nested fields
                print("Nested fields:")
                for nested in field.fields:
                    print(f"  - {nested.name} ({nested.field_type})")

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
        select_clause = ", ".join(fields)
        query = f"SELECT {select_clause} FROM `{dataset.full_path}`"
        if where:
            query += f" WHERE {where}"
        if limit:
            query += f" LIMIT {limit}"
        return self.query(dataset_name, query, as_dataframe)

if __name__ == "__main__":
    bq = BigQuery()
    bq.add_dataset(
        name='publications',
        project_id='covid-19-dimensions-ai',
        dataset='data',
        table='publications',
        billing_project_id='ucsd-discover'
    )

    bq.inspect_schema("publications")