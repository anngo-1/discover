import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';
import { Container, Paper, Stack, Text, Group, SimpleGrid, Box, ThemeIcon, Center, Loader, Skeleton, Select, Card, Tabs, Flex } from '@mantine/core';
import { TrendingUp, FileText, Users, Star } from 'lucide-react';
import useMetricsData from '@/hooks/getWorksMetricsData';
import { WorksFilterState } from '@/libs/types';
import { MetricCategory, MetricsCountTable, MetricData } from '@/components/MetricsCountTable';

const CHART_COLORS = [
  '#1c7ed6', '#37b24d', '#e64980', '#ff6b6b', '#4c6ef5', '#2d9cdb', '#6f42c1', '#00b894', '#e83e8c',
  '#007bff', '#fd7e14', '#20c997', '#d6336c', '#0dcaf0', '#6c757d', '#6610f2', '#28a745', '#dc3545',
  '#fdba74', '#17a2b8', '#0b5ed7', '#8e44ad', '#c0392b', '#2980b9', '#27ae60', '#d35400', '#8e44ad',
  '#2ecc71', '#3498db', '#e74c3c', '#9b59b6', '#1abc9c', '#16a085', '#34495e'
];

type PublicationType = 'conference_paper_count' | 'research_article_count' | 'review_article_count' |
  'editorial_count' | 'letter_to_editor_count' | 'other_conference_count' | 'other_journal_count' |
  'reference_work_count' | 'research_chapter_count';

const publicationTypeConfigs: { [key: string]: { name: string; color: string } } = {
  conference_paper_count: { name: 'Conference Papers', color: CHART_COLORS[1] },
  research_article_count: { name: 'Research Articles', color: CHART_COLORS[0] }, 
  review_article_count: { name: 'Reviews', color: CHART_COLORS[2] },
  editorial_count: { name: 'Editorials', color: CHART_COLORS[3] },
  letter_to_editor_count: { name: 'Letters to Editor', color: CHART_COLORS[4] },
  other_conference_count: { name: 'Other Conference', color: CHART_COLORS[5] },
  other_journal_count: { name: 'Other Journal', color: CHART_COLORS[6] },
  reference_work_count: { name: 'Reference Works', color: CHART_COLORS[7] },
  research_chapter_count: { name: 'Research Chapters', color: CHART_COLORS[8] }
};

interface TopConcept {
  concept_text: string;
  concept_count: number;
}

interface SdgCategory {
  name: string;
  sdg_count: number;
}

interface YearMetrics {
  conference_paper_count: number;
  research_article_count: number;
  review_article_count: number;
  avg_citations: number;
  avg_recent_citations: number;
  avg_field_citation_ratio: number;
  avg_altmetric_score: number;
  avg_collaborating_countries: number;
  avg_collaborating_institutions: number;
  clinical_trial_count: number;
  total_publications: number;
  top_concepts: TopConcept[];
  sdg_categories: SdgCategory[];
  editorial_count: number;
  letter_to_editor_count: number;
  other_conference_count: number;
  other_journal_count: number;
  reference_work_count: number;
  research_chapter_count: number;
}

interface TooltipProps {
  active?: boolean;
  payload?: { value: number; dataKey: string; name: string; color: string }[];
  label?: string;
}

const ResearchMetricsWrapper: React.FC<{ filters: WorksFilterState }> = ({ filters }) => {
  const { data: metrics, loading, error } = useMetricsData(filters);
  const [selectedYear, setSelectedYear] = useState<string>('9999');
  const [activeTab, setActiveTab] = useState<string>('publications');

  const timeSeriesData = useMemo(() => {
    if (!metrics?.data) return [];
    return Object.entries(metrics.data as unknown as Record<string, YearMetrics>)
      .map(([year, d]) => ({
        year: year === '9999' ? 'All Years' : year,
        conference_paper_count: d.conference_paper_count,
        research_article_count: d.research_article_count,
        review_article_count: d.review_article_count,
        editorial_count: d.editorial_count,
        letter_to_editor_count: d.letter_to_editor_count,
        other_conference_count: d.other_conference_count,
        other_journal_count: d.other_journal_count,
        reference_work_count: d.reference_work_count,
        research_chapter_count: d.research_chapter_count,
        avgCitations: d.avg_citations,
        avgRecentCitations: d.avg_recent_citations,
        fieldCitationRatio: d.avg_field_citation_ratio,
        altmetricScore: d.avg_altmetric_score,
        collaboratingCountries: d.avg_collaborating_countries,
        collaboratingInstitutions: d.avg_collaborating_institutions,
        total: d.total_publications,
        top_concepts: d.top_concepts.map(cat => ({
          concept_name: cat.concept_text,
          concept_count: cat.concept_count
        })),
        sdgCategories: d.sdg_categories.map(cat => ({
          name: cat.name,
          count: cat.sdg_count
        }))
      }))
      .sort((a, b) => parseInt(a.year) - parseInt(b.year));
  }, [metrics]);
  const yearOptions = useMemo(() => [
    { value: '9999', label: 'All Years' },
    ...timeSeriesData.filter(d => d.year !== 'All Years').map(d => ({ value: d.year, label: d.year }))
  ], [timeSeriesData]);

  const currentMetrics = useMemo(() => {
    const yearData = timeSeriesData.find(d => d.year === (selectedYear === '9999' ? 'All Years' : selectedYear));
    return yearData ? {
      total: yearData.total,
      avgCitations: yearData.avgCitations,
      avgAltmetric: yearData.altmetricScore,
      avgCollabs: yearData.collaboratingInstitutions,
      subtitle: selectedYear === '9999' ? 'All Time' : selectedYear,
      topConcepts: yearData.top_concepts,
      sdgCategories: yearData.sdgCategories,
    } : null;
  }, [timeSeriesData, selectedYear]);

  const metricCategories: MetricCategory[] = useMemo(() => [
    {
      id: 'sdgCategories',
      label: 'Sustainable Development Goals',
      data: (currentMetrics?.sdgCategories || []).reduce((acc: MetricData, category) => ({ ...acc, [category.name]: category.count }), {} as MetricData),
      searchable: true
    },
    {
      id: 'topConcepts',
      label: 'Common Keywords',
      data: (currentMetrics?.topConcepts || []).reduce((acc: MetricData, concept) => ({ ...acc, [concept.concept_name]: concept.concept_count }), {} as MetricData),
      searchable: true
    }
  ], [currentMetrics]);

  const chartData = useMemo(() =>
    selectedYear === '9999'
      ? timeSeriesData.filter(d => d.year !== 'All Years')
      : timeSeriesData.filter(d => d.year === selectedYear)
    , [timeSeriesData, selectedYear]);

  const activePublicationTypes = useMemo(() =>
    Object.entries(publicationTypeConfigs)
      .filter(([key]) => chartData.some(d => d[key as PublicationType] > 0))
      .map(([key, value]) => ({ key: key as PublicationType, ...value }))
    , [chartData]);

  const CustomTooltip: React.FC<TooltipProps> = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    const nonZeroPayload = payload.filter(item => item.value > 0);
    const sortedPayload = [...nonZeroPayload].sort((a, b) => (b.value || 0) - (a.value || 0));
    const countBasedMetrics = [
      'conference_paper_count',
      'research_article_count',
      'review_article_count',
      'editorial_count',
      'letter_to_editor_count',
      'other_conference_count',
      'other_journal_count',
      'reference_work_count',
      'research_chapter_count',
      'total'
    ];
    const countTotal = sortedPayload
      .filter(item => countBasedMetrics.includes(item.dataKey))
      .reduce((sum, item) => sum + (item.value || 0), 0);

    return (
      <Paper p="md" withBorder shadow="sm">
        <Text fw={700} mb="xs" size="sm">{label}</Text>
        {sortedPayload.map(item => (
          <Text key={item.name} size="sm" mb={4} style={{ color: item.color }}>
            {item.name}: {item.value.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
            {countBasedMetrics.includes(item.dataKey) && countTotal > 0 && ` (${((item.value / countTotal) * 100).toFixed(1)}%)`}
          </Text>
        ))}
      </Paper>
    );
  };

  const QuickMetricCard = ({ title, value, icon, subtitle }: { title: string; value: string | number; icon: React.ReactNode; subtitle?: string }) => (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group>
        <ThemeIcon size="lg" radius="md" variant="light">{icon}</ThemeIcon>
        <Box>
          <Text size="xs" fw={500} c="dimmed">{title}</Text>
          {loading ? <Skeleton height={28} mt={4} width={120} /> : <Text fw={700} size="lg">{value}</Text>}
          {subtitle && <Text size="xs" c="dimmed">{subtitle}</Text>}
        </Box>
      </Group>
    </Card>
  );

  if (error) return <Center><Text c="red" fw={700}>{error}</Text></Center>;

  return (
    <Container size="100%" px={0} w="100%" fluid>
      <Group justify="space-between" mb="md">
        <Text fw={700}>Research Metrics</Text>
        <Select w={200} value={selectedYear} onChange={value => setSelectedYear(value || '9999')} data={yearOptions} />
      </Group>

      <Stack gap="md">
        <SimpleGrid cols={{ base: 1, sm: 4 }} spacing="lg">
          <QuickMetricCard title="Total Publications" value={currentMetrics?.total.toLocaleString() || '0'} icon={<FileText size={18} />} subtitle={currentMetrics?.subtitle} />
          <QuickMetricCard title="Average Citations" value={(currentMetrics?.avgCitations || 0).toFixed(2)} icon={<TrendingUp size={18} />} subtitle={currentMetrics?.subtitle} />
          <QuickMetricCard title="Average Altmetric Score" value={(currentMetrics?.avgAltmetric || 0).toFixed(2)} icon={<Star size={18} />} subtitle={currentMetrics?.subtitle} />
          <QuickMetricCard title="Avg Collaborating Institutions" value={(currentMetrics?.avgCollabs || 0).toFixed(2)} icon={<Users size={18} />} subtitle={currentMetrics?.subtitle} />
        </SimpleGrid>

        <Paper shadow="sm" p="md" radius="md" withBorder>
          <Flex direction={{ base: 'column', md: 'row' }} gap="sm">
            <Box style={{ flex: 1, minWidth: 0 }} mt={4}>
              <Tabs value={activeTab} onChange={value => setActiveTab(value || 'publications')}>
                <Tabs.List mb="md">
                  <Tabs.Tab value="publications">Publication Types</Tabs.Tab>
                  <Tabs.Tab value="impact">Impact Metrics</Tabs.Tab>
                  <Tabs.Tab value="collaboration">Collaboration</Tabs.Tab>
                </Tabs.List>

                <Box h={430}>
                  {loading ? (
                    <Center h={400}><Loader size="lg" variant="bars" /></Center>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      {activeTab === 'publications' ? (
                        <BarChart data={chartData} barSize={60}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="year" />
                          <YAxis />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend />
                          {activePublicationTypes.map(type => (
                            <Bar key={type.key} dataKey={type.key} fill={type.color} name={type.name} />
                          ))}
                        </BarChart>
                      ) : activeTab === 'impact' ? (
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="year" />
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend />
                          {chartData.some(d => d.avgCitations > 0) && (
                            <Line yAxisId="left" type="monotone" dataKey="avgCitations" stroke={CHART_COLORS[0]} name="Avg Citations" />
                          )}
                          {chartData.some(d => d.avgRecentCitations > 0) && (
                            <Line yAxisId="left" type="monotone" dataKey="avgRecentCitations" stroke={CHART_COLORS[1]} name="Recent Citations" />
                          )}
                          {chartData.some(d => d.fieldCitationRatio > 0) && (
                            <Line yAxisId="left" type="monotone" dataKey="fieldCitationRatio" stroke={CHART_COLORS[2]} name="Field Citation Ratio" />
                          )}
                          {chartData.some(d => d.altmetricScore > 0) && (
                            <Line yAxisId="right" type="monotone" dataKey="altmetricScore" stroke={CHART_COLORS[3]} name="Altmetric Score" />
                          )}
                        </LineChart>
                      ) : activeTab === 'collaboration' ? (
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="year" />
                          <YAxis />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend />
                          {chartData.some(d => d.collaboratingInstitutions > 0) && (
                            <Line type="monotone" dataKey="collaboratingInstitutions" stroke={CHART_COLORS[0]} name="Avg Institutions" />
                          )}
                          {chartData.some(d => d.collaboratingCountries > 0) && (
                            <Line type="monotone" dataKey="collaboratingCountries" stroke={CHART_COLORS[1]} name="Avg Countries" />
                          )}
                        </LineChart>
                      ) : (
                        <></>
                      )}
                    </ResponsiveContainer>
                  )}
                </Box>
              </Tabs>
            </Box>

            <Box style={{ flex: 1, minWidth: 0 }}>
              <MetricsCountTable categories={metricCategories} isLoading={loading} />
            </Box>
          </Flex>
        </Paper>
      </Stack>
    </Container>
  );
};

export default ResearchMetricsWrapper;