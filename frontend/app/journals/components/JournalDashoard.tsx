import { FC, useMemo } from 'react';
import { Container, Stack, Center, Loader, Text, Button } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { JournalDashboardHeader } from './JournalDashboardHeader';
import { JournalDashboardStats } from './JournalDashboardStats';
import { JournalDashboardResults } from './JournalDashboardResults';
import { DistributionChart } from './charts/DistributionChart';
import { TimeSeriesChart } from './charts/TimeSeriesChart';
import { useJournalData } from '../hooks/getJournalsData';
import { COLORS } from '../utils/constants';
import { getTimeSeriesData } from '../utils/data';
import { AggregatedStats, JournalFilterState } from '@/libs/types';


interface JournalStatsProps {
    filters: JournalFilterState;
}

const JournalDashboard: FC<JournalStatsProps> = ({ filters }) => {
    const {
        loading,
        error,
        viewType,
        selectedYear,
        yearOptions,
        data: {
            filteredData,
            paginatedData,
            aggregateStats
        },
        controls: {
            setViewType,
            setSelectedYear,
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
            handlePageChange,
            setSelectedItem,
            setSearchQuery
        },
        pagination: {
            currentPage,
            sortBy,
            sortDirection
        },
        searchState: {
            searchQuery
        }
    } = useJournalData(filters);

    const distributionData = useMemo(() => {
        return [...filteredData]
            .sort((a, b) => {
                const aValue = a[distributionTopNFilter as keyof AggregatedStats];
                const bValue = b[distributionTopNFilter as keyof AggregatedStats];
            
                if (typeof aValue === 'number' && typeof bValue === 'number') {
                    return bValue - aValue;
                }
                return 0;
            })
            .slice(0, distributionTopNValue)
            .map(item => ({
                name: viewType === 'publishers' ? item.publisher_name : item.journal_name,
                publications: item.publication_count,
                citations: Math.round(item.avg_citations * 100) / 100,
                openAccess: item.open_access_count,
                withData: item.papers_with_data,
                fieldCitationRatio: item.avg_field_citation_ratio
            }));
    }, [filteredData, viewType, distributionTopNValue, distributionTopNFilter]);

    const timeSeriesData = selectedYear === 'all' 
        ? getTimeSeriesData(filteredData, timeSeriesTopNValue, viewType, timeSeriesTopNFilter)
        : [];

    const handleDownloadCSV = () => {
        const headers = ['Name', 'Publications', 'Avg Citations', 'Papers with Data', 'Open Access', 'Field Citation Ratio'];
        const csvData = filteredData.map(item => [
            viewType === 'publishers' ? item.publisher_name : item.journal_name,
            item.publication_count,
            item.avg_citations.toFixed(2),
            item.papers_with_data,
            item.open_access_count,
            item.avg_field_citation_ratio.toFixed(2)
        ]);

        const csvContent = [
            headers.join(','),
            ...csvData.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${viewType}_stats_${selectedYear === 'all' ? 'all_time' : selectedYear}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) {
        return (
            <Center style={{ height: 'calc(100vh - 300px)' }}>
                <Stack align="center" gap="md">
                    <Loader size="lg" variant="dots" />
                    <Text size="sm" c="dimmed">Loading journal statistics...</Text>
                </Stack>
            </Center>
        );
    }

    if (error) {
        return (
            <Center style={{ height: 'calc(100vh - 300px)' }}>
                <Stack align="center" gap="md">
                    <IconAlertCircle size={48} color="red" />
                    <Text size="lg" c="red">{error}</Text>
                    <Button variant="light" onClick={() => window.location.reload()}>
                        Try Again
                    </Button>
                </Stack>
            </Center>
        );
    }

    return (
        <Container size="100%" px={0} fluid>
            <Stack gap="md">
                <JournalDashboardHeader
                    viewType={viewType}
                    selectedYear={selectedYear}
                    yearOptions={yearOptions}
                    setViewType={setViewType}
                    setSelectedYear={setSelectedYear}
                />

                <JournalDashboardStats
                    viewType={viewType}
                    selectedYear={selectedYear}
                    filteredData={filteredData}
                    aggregateStats={aggregateStats}
                />

                <DistributionChart
                    data={distributionData}
                    chartType={chartType}
                    setChartType={setChartType}
                    topNValue={distributionTopNValue}
                    setTopNValue={setDistributionTopNValue}
                    topNFilter={distributionTopNFilter}
                    setTopNFilter={setDistributionTopNFilter}
                    viewType={viewType}
                    COLORS={COLORS}
                />

                {selectedYear === 'all' && (
                    <TimeSeriesChart
                        data={timeSeriesData}
                        topNValue={timeSeriesTopNValue}
                        setTopNValue={setTimeSeriesTopNValue}
                        topNFilter={timeSeriesTopNFilter}
                        setTopNFilter={setTimeSeriesTopNFilter}
                        timeSeriesMetric={timeSeriesMetric}
                        setTimeSeriesMetric={setTimeSeriesMetric}
                        viewType={viewType}
                        COLORS={COLORS}
                    />
                )}

                <JournalDashboardResults
                    viewType={viewType}
                    filteredData={filteredData}
                    paginatedData={paginatedData}
                    sortBy={sortBy}
                    sortDirection={sortDirection}
                    currentPage={currentPage}
                    itemsPerPage={20}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onSort={handleSort}
                    onPageChange={handlePageChange}
                    onSelect={setSelectedItem}
                    onDownloadCSV={handleDownloadCSV}
                />
            </Stack>
        </Container>
    );
};

export default JournalDashboard;