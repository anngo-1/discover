import { JournalStats, AggregatedStats, TimeSeriesData } from '@/libs/types';

export const aggregateData = (
    inputData: JournalStats[], 
    type: 'publishers' | 'journals'
): AggregatedStats[] => {
    const dataMap = new Map<string, AggregatedStats>();

    inputData.forEach(item => {
        const key = type === 'publishers' ? item.publisher_name : item.journal_name;

        if (!dataMap.has(key)) {
            const initialAggregatedStats: AggregatedStats = {
                ...item,
                publication_count: 0,
                open_access_count: 0,
                papers_with_data: 0,
                avg_citations: 0,
                avg_field_citation_ratio: 0,
                total_citations: 0,
                total_field_citations: 0,
                yearly_data: {}
            };
            dataMap.set(key, initialAggregatedStats);
        }

        const existing = dataMap.get(key)!;
        const yearKey = item.year.toString();

        if (!existing.yearly_data![yearKey]) {
            existing.yearly_data![yearKey] = {
                publication_count: 0,
                citations: 0,
                open_access_count: 0,
                papers_with_data: 0
            };
        }

        const yearData = existing.yearly_data![yearKey];
        yearData.publication_count += item.publication_count;
        yearData.citations += item.avg_citations * item.publication_count;
        yearData.open_access_count += item.open_access_count;
        yearData.papers_with_data += item.papers_with_data;

        dataMap.set(key, {
            ...existing,
            publication_count: existing.publication_count + item.publication_count,
            open_access_count: existing.open_access_count + item.open_access_count,
            papers_with_data: existing.papers_with_data + item.papers_with_data,
            total_citations: existing.total_citations + (item.avg_citations * item.publication_count),
            total_field_citations: existing.total_field_citations + (item.avg_field_citation_ratio * item.publication_count),
            first_publication: item.first_publication < existing.first_publication ?
                item.first_publication : existing.first_publication,
            last_publication: item.last_publication > existing.last_publication ?
                item.last_publication : existing.last_publication,
        });
    });

    return Array.from(dataMap.values()).map(item => ({
        ...item,
        avg_citations: item.total_citations / item.publication_count,
        avg_field_citation_ratio: item.total_field_citations / item.publication_count,
        open_access_ratio: (item.open_access_count / item.publication_count) * 100,
    }));
};

export const getTimeSeriesData = (
    data: AggregatedStats[], 
    topNValue: number, 
    viewType: string,
    topNFilter: string
): TimeSeriesData[] => {
    const allYears = new Set<number>();
    data.forEach(entity => {
        Object.keys(entity.yearly_data || {}).forEach(year => {
            allYears.add(parseInt(year));
        });
    });
    const sortedYears = Array.from(allYears).sort((a, b) => a - b);
    

    const yearlyRankings = new Map<number, string[]>();
    
    sortedYears.forEach(year => {
        const yearlyData = data
            .map(entity => ({
                name: viewType === 'publishers' ? entity.publisher_name : entity.journal_name,
                value: entity.yearly_data?.[year.toString()]?.[topNFilter as keyof typeof entity.yearly_data[string]] || 0
            }))
            .sort((a, b) => b.value - a.value)
            .slice(0, topNValue)
            .map(item => item.name);
            
        yearlyRankings.set(year, yearlyData);
    });

    const topEntitiesSet = new Set<string>();
    yearlyRankings.forEach(entities => {
        entities.forEach(entity => topEntitiesSet.add(entity));
    });

    const timeSeriesData: TimeSeriesData[] = [];

    Array.from(topEntitiesSet).forEach(entityName => {
        sortedYears.forEach(year => {
            const yearRankings = yearlyRankings.get(year) || [];
            if (yearRankings.includes(entityName)) {
                const entity = data.find(e => 
                    (viewType === 'publishers' ? e.publisher_name : e.journal_name) === entityName
                );
                const yearData = entity?.yearly_data?.[year.toString()];
                
                if (yearData) {
                    timeSeriesData.push({
                        year,
                        name: entityName,
                        publications: yearData.publication_count,
                        citations: yearData.citations / yearData.publication_count,
                        openAccess: yearData.open_access_count
                    });
                }
            }
        });
    });

    return timeSeriesData;
};

export const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 2
    }).format(num);
};

export const calculatePercentage = (value: number, total: number): number => {
    return total > 0 ? (value / total) * 100 : 0;
};