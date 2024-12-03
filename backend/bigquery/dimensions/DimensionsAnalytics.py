import asyncio
from typing import Dict, Any
import pandas as pd
from concurrent.futures import ThreadPoolExecutor
from .analytics.publication_analytics import PublicationAnalytics
from .analytics.collaboration_analytics import CollaborationAnalytics
from .analytics.researcher_analytics import ResearcherAnalytics
from .analytics.topic_analytics import TopicAnalytics
from .analytics.funding_analytics import FundingAnalytics
from .analytics.repository_analytics import RepositoryAnalytics
from .analytics.sdg_analytics import SDGAnalytics
from .analytics.institutional_analytics import InstitutionalAnalytics
from .analytics.trend_analytics import TrendAnalytics

class DimensionsAnalytics:
    
    def __init__(self, bq_client, max_workers: int = 10):
        self.bq = bq_client
        self.max_workers = max_workers
        self.loop = asyncio.get_event_loop()
        self.executor = ThreadPoolExecutor(max_workers=max_workers)
        
        self.publication_analytics = PublicationAnalytics(bq_client)
        self.collaboration_analytics = CollaborationAnalytics(bq_client)
        self.researcher_analytics = ResearcherAnalytics(bq_client)
        self.topic_analytics = TopicAnalytics(bq_client)
        self.funding_analytics = FundingAnalytics(bq_client)
        self.repository_analytics = RepositoryAnalytics(bq_client)
        self.sdg_analytics = SDGAnalytics(bq_client)
        self.institutional_analytics = InstitutionalAnalytics(bq_client)
        self.trend_analytics = TrendAnalytics(bq_client)
        
        self.analyses = {
            'publication_venues': self.publication_analytics.analyze,
            'publication_stats': self.publication_analytics.get_basic_stats,
            'collaborations': self.collaboration_analytics.analyze,
            'researcher_productivity': self.researcher_analytics.analyze,
            'research_topics': self.topic_analytics.analyze,
            'funding_patterns': self.funding_analytics.analyze,
            'data_repositories': self.repository_analytics.analyze,
            'sdg_impact': self.sdg_analytics.analyze,
            'institutional_impact': self.institutional_analytics.analyze,
            'research_trends': self.trend_analytics.analyze
        }

    async def _run_analysis(self, analysis_func, dataset_name: str, filters: Dict[str, Any]) -> pd.DataFrame:
        """Run a single analysis in the thread pool"""
        if hasattr(analysis_func, '__self__'):
            func = lambda: analysis_func(dataset_name, filters)
        else:
            func = lambda: analysis_func(dataset_name, filters)
        return await self.loop.run_in_executor(
            self.executor,
            func
        )

    async def run_single_analysis(
        self,
        analysis_name: str,
        dataset_name: str,
        filters: Dict[str, Any]
    ) -> pd.DataFrame:

        if analysis_name not in self.analyses:
            valid_analyses = list(self.analyses.keys())
            raise ValueError(f"Unknown analysis '{analysis_name}'. Valid analyses are: {valid_analyses}")
            
        analysis_func = self.analyses[analysis_name]
        try:
            result = await self._run_analysis(analysis_func, dataset_name, filters)
            print(f"Completed analysis: {analysis_name}")
            return result
        except Exception as e:
            print(f"Error in {analysis_name} analysis: {str(e)}")
            raise

    async def run_concurrent_analyses(
        self,
        dataset_name: str,
        filters: Dict[str, Any]
    ) -> Dict[str, pd.DataFrame]:
        """Run all analyses concurrently using asyncio and ThreadPoolExecutor"""
        tasks = []
        for name, analysis_func in self.analyses.items():
            task = asyncio.create_task(
                self._run_analysis(analysis_func, dataset_name, filters)
            )
            tasks.append((name, task))

        results = {}
        for name, task in tasks:
            try:
                result = await task
                print(f"Completed analysis: {name}")
                results[name] = result
            except Exception as e:
                print(f"Error in {name} analysis: {str(e)}")
                results[name] = None
        return results

    def __del__(self):
        """Cleanup executor on deletion"""
        if hasattr(self, 'executor'):
            self.executor.shutdown(wait=False)