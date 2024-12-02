import { useState, useEffect, useMemo } from 'react';
import { aggregateData } from '../utils/data';
import { JournalStats, AggregatedStats, JournalFilterState } from '@/libs/types';

type SortableFields = 'publication_count' | 'avg_citations' | 'papers_with_data' | 'open_access_count' | 'avg_field_citation_ratio';

export const useJournalData = (filters: JournalFilterState) => {
    const [data, setData] = useState<JournalStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [viewType, setViewType] = useState('publishers');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedYear, setSelectedYear] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState<SortableFields>('publication_count');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [selectedItem, setSelectedItem] = useState<AggregatedStats | null>(null);
   
    const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');
    const [timeSeriesMetric, setTimeSeriesMetric] = useState<'publications' | 'citations' | 'openAccess'>('publications');
    
    const [distributionTopNValue, setDistributionTopNValue] = useState(10);
    const [distributionTopNFilter, setDistributionTopNFilter] = useState<string>('publication_count');
    const [timeSeriesTopNValue, setTimeSeriesTopNValue] = useState(10);
    const [timeSeriesTopNFilter, setTimeSeriesTopNFilter] = useState<string>('publication_count');

    const host = process.env.NEXT_PUBLIC_HOST;
    console.log(selectedItem)
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(
                    `${host}/works/dimensions/journal_stats?filter=${JSON.stringify(filters)}`
                );
                if (!response.ok) throw new Error(`Error: ${response.statusText}`);
                const result = await response.json();
                setData(result.data);
                if (!selectedYear) {
                    setSelectedYear('all');
                }
            } catch (error) {
                console.error('Error:', error);
                setError('Failed to load data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [filters, host]);

    const yearOptions = useMemo(() => {
        const years = Array.from(new Set(data.map(item => item.year)))
            .sort((a, b) => b - a)
            .map(year => ({ value: year.toString(), label: year.toString() }));

        return [
            { value: 'all', label: 'All Time' },
            ...years
        ];
    }, [data]);

    const filteredData = useMemo(() => {
        let filtered = data;

        if (selectedYear && selectedYear !== 'all') {
            filtered = filtered.filter(item => item.year.toString() === selectedYear);
        }

        const aggregated = aggregateData(filtered, viewType === 'publishers' ? 'publishers' : 'journals');

        return aggregated.filter(item =>
            (viewType === 'publishers' ? item.publisher_name : item.journal_name)
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
        );
    }, [data, searchQuery, selectedYear, viewType]);

    const sortedData = useMemo(() => {
        return [...filteredData].sort((a, b) => {
            const factor = sortDirection === 'asc' ? 1 : -1;
            return factor * (a[sortBy] > b[sortBy] ? 1 : -1);
        });
    }, [filteredData, sortBy, sortDirection]);

    const paginatedData = useMemo(() => {
        const itemsPerPage = 20;
        return sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    }, [sortedData, currentPage]);

    const aggregateStats = useMemo(() => {
        const total = filteredData.reduce((acc, item) => ({
            publications: acc.publications + item.publication_count,
            citations: acc.citations + (item.avg_citations * item.publication_count),
            openAccess: acc.openAccess + item.open_access_count,
            withData: acc.withData + item.papers_with_data
        }), {
            publications: 0,
            citations: 0,
            openAccess: 0,
            withData: 0
        });

        return {
            ...total,
            avgCitations: total.citations / total.publications || 0,
            openAccessRatio: (total.openAccess / total.publications * 100) || 0,
            withDataRatio: (total.withData / total.publications * 100) || 0
        };
    }, [filteredData]);

    const handleSort = (field: SortableFields) => {
        if (sortBy === field) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortDirection('desc');
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return {
        loading,
        error,
        viewType,
        selectedYear,
        yearOptions,
        searchState: {
            searchQuery
        },
        data: {
            filteredData,
            sortedData,
            paginatedData,
            aggregateStats
        },
        controls: {
            setViewType,
            setSelectedYear,
            setSearchQuery,
            setCurrentPage,
            setSortBy,
            setSortDirection,
            setSelectedItem,
            chartType,
            setChartType,
            timeSeriesMetric,
            setTimeSeriesMetric,
            distributionTopNValue,
            setDistributionTopNValue,
            distributionTopNFilter,
            setDistributionTopNFilter,
            timeSeriesTopNValue,
            setTimeSeriesTopNValue,
            timeSeriesTopNFilter,
            setTimeSeriesTopNFilter,
            handleSort,
            handlePageChange
        },
        pagination: {
            currentPage,
            sortBy,
            sortDirection
        }
    };
};