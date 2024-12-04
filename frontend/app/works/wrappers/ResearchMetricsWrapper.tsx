import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Container, Paper, Stack, Text, Group, SimpleGrid, Box, Center, Loader, Select, SegmentedControl, Flex } from '@mantine/core';
import { FileText, Users, Lock, Building2 } from 'lucide-react';
import useMetricsData, { YearMetrics } from '@/hooks/getWorksMetricsData';
import { WorksFilterState } from '@/libs/types';
import { MetricsCountTable } from '@/components/MetricsCountTable';
import QuickMetricCard from '@/components/QuickMetricCard';

const COLORS = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'];
const CHART_COLORS = ['#1c7ed6', '#37b24d', '#e64980', '#ff6b6b', '#4c6ef5', '#2d9cdb', '#6f42c1', '#00b894', '#e83e8c', '#007bff', '#fd7e14', '#20c997', '#d6336c', '#0dcaf0', '#6c757d', '#6610f2', '#28a745', '#dc3545', '#fdba74', '#17a2b8', '#0b5ed7', '#8e44ad', '#c0392b', '#2980b9', '#27ae60', '#d35400', '#8e44ad', '#2ecc71', '#3498db', '#e74c3c', '#9b59b6', '#1abc9c', '#16a085', '#34495e'];

type PublicationType = 'conference_paper_count' | 'research_article_count' | 'review_article_count' | 'editorial_count' | 'letter_to_editor_count' | 'other_conference_count' | 'other_journal_count' | 'reference_work_count' | 'research_chapter_count';
const publicationTypeConfigs: Record<PublicationType, { name: string; color: string }> = {
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
interface TooltipPayload {
  dataKey: string;
  name: string;
  value: number;
  color: string;
}


const CustomTooltip: React.FC<{ active?: boolean; payload?: TooltipPayload[]; label?: string }> = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  const nonZeroPayload = payload.filter(item => item.value > 0);
  const sortedPayload = [...nonZeroPayload].sort((a, b) => b.value - a.value);
  const countBasedMetrics = ['conference_paper_count', 'research_article_count', 'review_article_count', 'editorial_count', 'letter_to_editor_count', 'other_conference_count', 'other_journal_count', 'reference_work_count', 'research_chapter_count', 'total'];
  const countTotal = sortedPayload.filter(item => countBasedMetrics.includes(item.dataKey)).reduce((sum, item) => sum + item.value, 0);
  return (
    <Paper p="md" withBorder shadow="sm">
      <Text fw={700} mb="xs" size="sm">{label}</Text>
      {sortedPayload.map(item => (
        <Text key={item.name} size="sm" mb={4} style={{ color: item.color }}>
          {item.name}: {item.value.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
          {countBasedMetrics.includes(item.dataKey) && countTotal > 0 && ` (${(item.value / countTotal * 100).toFixed(1)}%)`}
        </Text>
      ))}
    </Paper>
  );
};



const ResearchMetricsWrapper: React.FC<{ filters: WorksFilterState }> = ({ filters }) => {
  const { data: metrics, loading, error } = useMetricsData(filters);
  const [selectedYear, setSelectedYear] = useState<string>('9999');
  const [activeTab, setActiveTab] = useState<string>('publications');

  const timeSeriesData = useMemo(() => {
    if (!metrics?.data) return [];
    return Object.entries(metrics.data)
      .map(([year, d]: [string, YearMetrics]) => ({
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
        total_publications: d.total_publications,
        total_clinical_trials: d.total_clinical_trials,
        total_patents: d.total_patents,
        total_funding_instances: d.total_funding_instances,
        avg_field_citation_ratio: d.avg_field_citation_ratio,
        collaboratingCountries: d.avg_collaborating_countries,
        collaboratingInstitutions: d.avg_collaborating_institutions,
        total: d.total_publications,
        top_concepts: d.top_concepts,
        sdgCategories: d.sdg_categories,
        openAccessTypes: d.open_access_types
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
      avgFieldCitationRatio: yearData.avg_field_citation_ratio,
      avgCollabs: yearData.collaboratingInstitutions,
      subtitle: selectedYear === '9999' ? 'All Time' : selectedYear,
      topConcepts: yearData.top_concepts,
      sdgCategories: yearData.sdgCategories,
      openAccessTypes: yearData.openAccessTypes
    } : {
      total: 0, avgFieldCitationRatio: 0, avgCollabs: 0, subtitle: selectedYear === '9999' ? 'All Time' : selectedYear, topConcepts: [], sdgCategories: [], openAccessTypes: []
    };
  }, [timeSeriesData, selectedYear]);

  const oaData = useMemo(() => currentMetrics?.openAccessTypes?.map(({ category, count }) => ({ name: category.replace(/_/g, ' ').toUpperCase(), value: count })) || [], [currentMetrics]);

  interface MetricData {
    [key: string]: number;
  }

  interface MetricCategory {
    id: string;
    label: string;
    data: MetricData;
    searchable: boolean;
  }

  const metricCategories: MetricCategory[] = useMemo(() => {
    if (!metrics?.data || !selectedYear || !metrics.data[selectedYear]) return [];

    const yearData = metrics.data[selectedYear];

    return [
      {
        id: 'sdgCategories',
        label: 'Sustainable Development Goals',
        data: yearData.sdg_categories.reduce<MetricData>((acc, category) => ({
          ...acc,
          [category.name]: category.sdg_count
        }), {}),
        searchable: true
      },
      {
        id: 'topConcepts',
        label: 'Common Keywords',
        data: yearData.top_concepts.reduce<MetricData>((acc, concept) => ({
          ...acc,
          [concept.concept_text || '']: concept.concept_count || 0
        }), {}),
        searchable: true
      },
      {
        id: 'topAuthors',
        label: 'Top Authors',
        data: yearData.top_authors.reduce<MetricData>((acc, author) => ({
          ...acc,
          [author.author || '']: author.count
        }), {}),
        searchable: true
      },
      {
        id: 'topJournals',
        label: 'Top Journals',
        data: yearData.top_journals.reduce<MetricData>((acc, journal) => ({
          ...acc,
          [journal.journal || '']: journal.count
        }), {}),
        searchable: true
      },
      {
        id: 'topPublishers',
        label: 'Top Publishers',
        data: yearData.top_publishers.reduce<MetricData>((acc, publisher) => ({
          ...acc,
          [publisher.publisher || '']: publisher.count
        }), {}),
        searchable: true
      },
      {
        id: 'meshTerms',
        label: 'MeSH Terms',
        data: yearData.top_mesh_terms.reduce<MetricData>((acc, term) => ({
          ...acc,
          [term.term || '']: term.term_count || 0
        }), {}),
        searchable: true
      },
      {
        id: 'openAccess',
        label: 'Open Access Types',
        data: yearData.open_access_types.reduce<MetricData>((acc, type) => ({
          ...acc,
          [type.category]: type.count
        }), {}),
        searchable: false
      },
      {
        id: 'docTypes',
        label: 'Document Types',
        data: yearData.doc_type_counts.reduce<MetricData>((acc, type) => ({
          ...acc,
          [type.doc_type || 'Unspecified']: type.doc_count
        }), {}),
        searchable: false
      },
      {
        id: 'collaboratingInstitutions',
        label: 'Top Collaborating Institutions',
        data: yearData.top_collaborating_institutions.reduce<MetricData>((acc, inst) => ({
          ...acc,
          [inst.org || '']: inst.count
        }), {}),
        searchable: true
      },
      {
        id: 'topCountries',
        label: 'Top Contributing Countries',
        data: yearData.top_countries.reduce<MetricData>((acc, country) => ({
          ...acc,
          [country.country || '']: country.count
        }), {}),
        searchable: true
      },
      {
        id: 'topFunders',
        label: 'Top Funding Organizations',
        data: yearData.top_funders.reduce<MetricData>((acc, funder) => ({
          ...acc,
          [funder.funder || '']: funder.count
        }), {}),
        searchable: true
      }
    ];
  }, [metrics, selectedYear]);

  const chartData = useMemo(() => (selectedYear === '9999' ? timeSeriesData.filter(d => d.year !== 'All Years') : timeSeriesData.filter(d => d.year === selectedYear)), [timeSeriesData, selectedYear]);
  const activePublicationTypes = useMemo(() => Object.entries(publicationTypeConfigs).filter(([key]) => (chartData || []).some(d => d[key as PublicationType] > 0)).map(([key, value]) => ({ key: key as PublicationType, ...value })), [chartData]);
  const chartOptions = [
    { label: 'Publications', value: 'publications' },
    { label: 'Impact', value: 'research-impact' },
    { label: 'Collab', value: 'collaboration' },
    { label: 'OA Stats', value: 'openAccess' },
    { label: 'OA Trends', value: 'oa-trends' }
  ];

  if (error) return <Center><Text c="red" fw={700}>{error}</Text></Center>;

  return (
    <Container size="100%" px={0} w="100%" fluid>
      <Group justify="space-between" mb="md">
        <Text fw={700}>Research Metrics</Text>
        <Select w={200} value={selectedYear} onChange={value => setSelectedYear(value || '9999')} data={yearOptions} />
      </Group>
      <Stack gap="md">
        <SimpleGrid cols={{ base: 1, sm: 4 }} spacing="md">
          <QuickMetricCard
            title="Total Publications"
            value={currentMetrics?.total?.toLocaleString() ?? 0}
            icon={<FileText size={16} />}
            subtitle={currentMetrics.subtitle}
            loading={loading}
          />
          <QuickMetricCard
            title="Active Countries"
            value={metrics?.data[selectedYear]?.unique_countries_count?.toLocaleString() ?? 0}
            icon={<Users size={16} />}
            subtitle="Contributing Nations"
            loading={loading}
          />
          <QuickMetricCard
            title="Collaborating Institutions"
            value={currentMetrics?.avgCollabs?.toFixed(1) ?? 0}
            icon={<Building2 size={16} />}
            subtitle="Average per Paper"
            loading={loading}
          />
          <QuickMetricCard
            title="Open Access"
            value={metrics?.data[selectedYear]?.open_access_types?.[0]?.count?.toLocaleString() ?? 0}
            icon={<Lock size={16} />}
            subtitle="Publications with full open access"
            loading={loading}
          />
        </SimpleGrid>
        <Paper shadow="sm" p="md" radius="md" withBorder>
          <Flex direction={{ base: 'column', md: 'row' }} gap="sm">
            <Box style={{ flex: 1, minWidth: 0 }} mt={4}>
              <Group mb="md" justify="left">
                <SegmentedControl
                  value={activeTab}
                  onChange={setActiveTab}
                  data={chartOptions}
                  size="sm"
                />
              </Group>
              <Box h={430}>
                {loading ? (
                  <Center h={400}><Loader size="lg" variant="bars" /></Center>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    {(() => {
                      switch (activeTab) {
                        case 'publications':
                          return (
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
                          );
                        case 'research-impact':
                          return (
                            <LineChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="year" />
                              <YAxis yAxisId="left" />
                              <YAxis yAxisId="right" orientation="right" />
                              <Tooltip content={<CustomTooltip />} />
                              <Legend />
                              <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="total_publications"
                                stroke={CHART_COLORS[0]}
                                name="Total Publications"
                              />
                              <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="total_clinical_trials"
                                stroke={CHART_COLORS[1]}
                                name="Clinical Trials"
                              />
                              <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="total_patents"
                                stroke={CHART_COLORS[2]}
                                name="Patents"
                              />
                              <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="total_funding_instances"
                                stroke={CHART_COLORS[3]}
                                name="Funding Instances"
                              />
                              <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="avg_field_citation_ratio"
                                stroke={CHART_COLORS[4]}
                                name="Field Citation Ratio"
                              />
                            </LineChart>
                          );
                        case 'collaboration':
                          return (
                            <LineChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="year" />
                              <YAxis />
                              <Tooltip content={<CustomTooltip />} />
                              <Legend />
                              <Line
                                type="monotone"
                                dataKey="collaboratingInstitutions"
                                stroke={CHART_COLORS[0]}
                                name="Avg Institutions"
                              />
                              <Line
                                type="monotone"
                                dataKey="collaboratingCountries"
                                stroke={CHART_COLORS[1]}
                                name="Avg Countries"
                              />
                            </LineChart>
                          );
                        case 'openAccess':
                          return (
                            <PieChart>
                              <Pie
                                data={oaData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={120}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                              >
                                {oaData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                              <Legend />
                            </PieChart>
                          );
                        case 'oa-trends':
                          return (
                            <LineChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="year" />
                              <YAxis />
                              <Tooltip content={<CustomTooltip />} />
                              <Legend />
                              {currentMetrics.openAccessTypes?.map((type, index) => (
                                <Line
                                  key={type.category}
                                  type="monotone"
                                  dataKey={`openAccessTypes[${index}].count`}
                                  stroke={CHART_COLORS[index]}
                                  name={type.category.replace(/_/g, ' ').toUpperCase()}
                                />
                              ))}
                            </LineChart>
                          );
                        default:
                          return (
                            <BarChart data={[]}>
                              <XAxis />
                              <YAxis />
                            </BarChart>
                          );
                      }
                    })()}
                  </ResponsiveContainer>
                )}
              </Box>
            </Box>

            <Box style={{ flex: 1, minWidth: 0 }}>
              <MetricsCountTable
                categories={metricCategories}
                isLoading={loading}
                defaultActiveTab={metricCategories[0]?.id}
              />
            </Box>
          </Flex>
        </Paper>


      </Stack>
    </Container>
  );
};

export default ResearchMetricsWrapper;