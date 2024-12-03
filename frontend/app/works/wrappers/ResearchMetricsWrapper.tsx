import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';
import { Container, Paper, Stack, Text, Group, SimpleGrid, Box, ThemeIcon, Center, Loader, Skeleton, Select, Card, Tabs, Flex } from '@mantine/core';
import { TrendingUp, FileText, Users, Star } from 'lucide-react';
import useMetricsData from '@/hooks/getWorksMetricsData';
import { WorksFilterState } from '@/libs/types';
import { MetricCategory, MetricsCountTable, MetricData } from '@/components/MetricsCountTable';

const CHART_COLORS = [
  '#1c7ed6', // Blue
  '#37b24d', // Green
  '#e64980', // Pink
  '#ff6b6b', // Red
  '#4c6ef5', // Purple
  '#2d9cdb', // Light Blue
  '#6f42c1', // Lavender
  '#00b894', // Teal
  '#e83e8c', // Bright Pink
  '#007bff', // Strong Blue
  '#fd7e14', // Orange
  '#20c997', // Mint Green
  '#d6336c', // Raspberry
  '#0dcaf0', // Light Cyan
  '#6c757d', // Gray
  '#6610f2', // Violet
  '#28a745', // Emerald Green
  '#dc3545', // Red (Crimson)
  '#fdba74', // Peach
  '#17a2b8', // Turquoise
  '#0b5ed7', // Cobalt Blue
  '#8e44ad', // Amethyst
  '#c0392b', // Fire Engine Red
  '#2980b9', // Bright Sky Blue
  '#27ae60', // Grass Green
  '#d35400', // Pumpkin Orange
  '#8e44ad', // Purple
  '#2ecc71', // Bright Green
  '#3498db', // Light Blue
  '#e74c3c', // Coral Red
  '#9b59b6', // Lavender Purple
  '#1abc9c', // Aqua Green
  '#16a085', // Deep Teal
  '#34495e'  // Charcoal
];

interface SdgCategory {
  name: string;
  sdg_count: number;
}

type PublicationType = 'articles' | 'reviews' | 'editorialCount' | 'letterToEditorCount' | 
  'otherConferenceCount' | 'otherJournalCount' | 'referenceWorkCount' | 'researchChapterCount';

interface PublicationTypeConfig {
  key: PublicationType;
  name: string;
  color: string;
}

interface TopConcept {
  concept_text: string;
  concept_count: number;
}

interface TooltipPayloadItem {
  value: number;
  dataKey: string;
  name: string;
  color: string;
}

interface TooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

export interface YearMetrics {
  avg_citations: number;
  avg_recent_citations: number;
  avg_field_citation_ratio: number;
  avg_altmetric_score: number;
  avg_collaborating_countries: number;
  avg_collaborating_institutions: number;
  clinical_trial_count: number;
  international_collaborations: number;
  open_access_ratio: number;
  research_article_count: number;
  review_article_count: number;
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

interface QuickMetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  subtitle?: string;
}

const ResearchMetricsWrapper: React.FC<{ filters: WorksFilterState }> = ({ filters }) => {
  const { data: metrics, loading, error } = useMetricsData(filters);
  const [selectedYear, setSelectedYear] = useState<string>('9999');
  const [activeTab, setActiveTab] = useState<string>('publications');

  const alltimeSeriesData = useMemo(() => {
    if (!metrics?.data) return [];
    return Object.entries(metrics.data as Record<string, YearMetrics>)
      .filter(([year]) => year === '9999')
      .map(([year, d]) => ({
        year,
        articles: d.research_article_count,
        reviews: d.review_article_count,
        clinicalTrials: d.clinical_trial_count,
        avgCitations: d.avg_citations,
        avgRecentCitations: d.avg_recent_citations,
        fieldCitationRatio: d.avg_field_citation_ratio,
        altmetricScore: d.avg_altmetric_score,
        collaboratingCountries: d.avg_collaborating_countries,
        collaboratingInstitutions: d.avg_collaborating_institutions,
        total: d.total_publications,
        editorialCount: d.editorial_count,
        letterToEditorCount: d.letter_to_editor_count,
        otherConferenceCount: d.other_conference_count,
        otherJournalCount: d.other_journal_count,
        referenceWorkCount: d.reference_work_count,
        researchChapterCount: d.research_chapter_count,
        top_concepts: d.top_concepts.map(cat => ({
          concept_name: cat.concept_text,
          concept_count: cat.concept_count
        })) || [],
        sdgCategories: d.sdg_categories.map(cat => ({
          name: cat.name,
          count: cat.sdg_count
        })) || [],
      }))
      .sort((a, b) => parseInt(a.year) - parseInt(b.year));
  }, [metrics]);

  const timeSeriesData = useMemo(() => {
    if (!metrics?.data) return [];
    return Object.entries(metrics.data as Record<string, YearMetrics>)
      .filter(([year]) => year !== '9999')
      .map(([year, d]) => ({
        year,
        articles: d.research_article_count,
        reviews: d.review_article_count,
        clinicalTrials: d.clinical_trial_count,
        avgCitations: d.avg_citations,
        avgRecentCitations: d.avg_recent_citations,
        fieldCitationRatio: d.avg_field_citation_ratio,
        altmetricScore: d.avg_altmetric_score,
        collaboratingCountries: d.avg_collaborating_countries,
        collaboratingInstitutions: d.avg_collaborating_institutions,
        total: d.total_publications,
        editorialCount: d.editorial_count,
        letterToEditorCount: d.letter_to_editor_count,
        otherConferenceCount: d.other_conference_count,
        otherJournalCount: d.other_journal_count,
        referenceWorkCount: d.reference_work_count,
        researchChapterCount: d.research_chapter_count,
        top_concepts: d.top_concepts.map(cat => ({
          concept_name: cat.concept_text,
          concept_count: cat.concept_count
        })) || [],
        sdgCategories: d.sdg_categories.map(cat => ({
          name: cat.name,
          count: cat.sdg_count
        })) || [],
      }))
      .sort((a, b) => parseInt(a.year) - parseInt(b.year));
  }, [metrics]);

  const yearOptions = useMemo(() => [
    { value: '9999', label: 'All Years' },
    ...timeSeriesData.map(d => ({ value: d.year, label: d.year }))
  ], [timeSeriesData]);

  const currentMetrics = useMemo(() => {
    if (selectedYear === '9999') {
      const yearData = alltimeSeriesData.find(d => d.year === '9999');
      return yearData ? {
        total: yearData.total,
        avgCitations: yearData.avgCitations,
        avgAltmetric: yearData.altmetricScore,
        avgCollabs: yearData.collaboratingInstitutions,
        subtitle: 'All Time',
        topConcepts: yearData.top_concepts || [],
        sdgCategories: yearData.sdgCategories || []
      } : null;
    }

    const yearData = timeSeriesData.find(d => d.year === selectedYear);
    return yearData ? {
      total: yearData.total,
      avgCitations: yearData.avgCitations,
      avgAltmetric: yearData.altmetricScore,
      avgCollabs: yearData.collaboratingInstitutions,
      subtitle: selectedYear,
      topConcepts: yearData.top_concepts || [],
      sdgCategories: yearData.sdgCategories || []
    } : null;
  }, [timeSeriesData, alltimeSeriesData, selectedYear]);

  const metricCategories: MetricCategory[] = useMemo(() => [
    {
      id: 'sdgCategories',
      label: 'Sustainable Development Goals',
      data: (currentMetrics?.sdgCategories || []).reduce((acc, category) => {
        acc[category.name] = category.count;
        return acc;
      }, {} as MetricData),
      searchable: true
    },
    {
      id: 'topConcepts',
      label: 'Common Keywords',
      data: (currentMetrics?.topConcepts || []).reduce((acc, concept) => {
        acc[concept.concept_name] = concept.concept_count;
        return acc;
      }, {} as MetricData),
      searchable: true
    }
  ], [currentMetrics]);

  const filteredData = useMemo(() =>
    selectedYear === '9999' ? timeSeriesData : timeSeriesData.filter(d => d.year === selectedYear),
    [timeSeriesData, selectedYear]
  );

  const typeConfigs: PublicationTypeConfig[] = useMemo(() => [
    { key: 'articles', name: 'Research Articles', color: CHART_COLORS[0] },
    { key: 'reviews', name: 'Reviews', color: CHART_COLORS[1] },
    { key: 'editorialCount', name: 'Editorial Count', color: CHART_COLORS[2] },
    { key: 'letterToEditorCount', name: 'Letters to Editors', color: CHART_COLORS[3] },
    { key: 'otherConferenceCount', name: 'Other Conference', color: CHART_COLORS[4] },
    { key: 'otherJournalCount', name: 'Other Journals', color: CHART_COLORS[5] },
    { key: 'referenceWorkCount', name: 'Reference Works', color: CHART_COLORS[6] },
    { key: 'researchChapterCount', name: 'Research Chapters', color: CHART_COLORS[7] }
  ], []);

  const activePublicationTypes = useMemo(() => {
    if (!filteredData?.length) return typeConfigs;
    return typeConfigs;
  }, [filteredData, typeConfigs]);

  const CustomTooltip: React.FC<TooltipProps> = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
  
    const sortedPayload = [...payload]
      .sort((a, b) => (b.value || 0) - (a.value || 0));
  
    const countBasedMetrics = [
      'articles', 'reviews', 'editorialCount', 'letterToEditorCount',
      'otherConferenceCount', 'otherJournalCount', 'referenceWorkCount',
      'researchChapterCount', 'clinicalTrials', 'total'
    ];
  
    const countTotal = sortedPayload
      .filter(item => countBasedMetrics.includes(item.dataKey))
      .reduce((sum, item) => sum + (item.value || 0), 0);
  
    return (
      <Paper p="md" withBorder shadow="sm" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
        <Text fw={700} mb="xs" size="sm">{label}</Text>
        {sortedPayload.map((item) => {
          if (item.value <= 0) return null;
          
          const isCountBased = countBasedMetrics.includes(item.dataKey);
          return (
            <Text key={item.name} size="sm" mb={4} style={{ color: item.color }}>
              {item.name}: {item.value.toLocaleString(undefined, {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1
              })}
              {isCountBased && countTotal > 0 && ` (${((item.value / countTotal) * 100).toFixed(1)}%)`}
            </Text>
          );
        })}
      </Paper>
    );
  };

  const QuickMetricCard: React.FC<QuickMetricCardProps> = ({ title, value, icon, subtitle }) => (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group>
        <ThemeIcon size="lg" radius="md" variant="light">{icon}</ThemeIcon>
        <Box>
          <Text size="xs" fw={500} c="dimmed">{title}</Text>
          {loading ? (
            <Skeleton height={28} mt={4} width={120} />
          ) : (
            <Text fw={700} size="lg">{value}</Text>
          )}
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
        <Select
          w={200}
          value={selectedYear}
          onChange={(value) => setSelectedYear(value || '9999')}
          data={yearOptions}
        />
      </Group>

      <Stack gap="md">
        <SimpleGrid cols={{ base: 1, sm: 4 }} spacing="lg">
          <QuickMetricCard
            title="Total Publications"
            value={currentMetrics?.total.toLocaleString() || '0'}
            icon={<FileText size={18} />}
            subtitle={currentMetrics?.subtitle}
          />
          <QuickMetricCard
            title="Average Citations"
            value={(currentMetrics?.avgCitations || 0).toFixed(2)}
            icon={<TrendingUp size={18} />}
            subtitle={currentMetrics?.subtitle}
          />
          <QuickMetricCard
            title="Average Altmetric Score"
            value={(currentMetrics?.avgAltmetric || 0).toFixed(2)}
            icon={<Star size={18} />}
            subtitle={currentMetrics?.subtitle}
            />
            <QuickMetricCard
              title="Avg Collaborating Institutions"
              value={(currentMetrics?.avgCollabs || 0).toFixed(2)}
              icon={<Users size={18} />}
              subtitle={currentMetrics?.subtitle}
            />
          </SimpleGrid>
  
          <Paper shadow="sm" p="md" radius="md" withBorder>
            <Flex
              direction={{ base: 'column', md: 'row' }}
              gap="sm"
            >
              <Box style={{ flex: 1, minWidth: 0 }} mt={4}>
                <Tabs value={activeTab} onChange={(value) => setActiveTab(value || 'publications')}>
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
                          <BarChart
                            data={filteredData}
                            barSize={60}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            {activePublicationTypes.map((type) => (
                              <Bar 
                                key={type.key}
                                dataKey={type.key}
                                fill={type.color}
                                name={type.name}
                                hide={filteredData.every(d => !d[type.key] || d[type.key] === 0)}
                              />
                            ))}
                          </BarChart>
                        ) : activeTab === 'impact' ? (
                          <LineChart data={filteredData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            <YAxis yAxisId="left" />
                            <YAxis yAxisId="right" orientation="right" />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line yAxisId="left" type="monotone" dataKey="avgCitations" stroke={CHART_COLORS[0]} name="Avg Citations" />
                            <Line yAxisId="left" type="monotone" dataKey="avgRecentCitations" stroke={CHART_COLORS[1]} name="Recent Citations" />
                            <Line yAxisId="right" type="monotone" dataKey="altmetricScore" stroke={CHART_COLORS[2]} name="Altmetric Score" />
                          </LineChart>
                        ) : (
                          <LineChart data={filteredData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line type="monotone" dataKey="collaboratingInstitutions" stroke={CHART_COLORS[0]} name="Avg Institutions" />
                            <Line type="monotone" dataKey="collaboratingCountries" stroke={CHART_COLORS[1]} name="Avg Countries" />
                          </LineChart>
                        )}
                      </ResponsiveContainer>
                    )}
                  </Box>
                </Tabs>
              </Box>
  
              <Box style={{ flex: 1, minWidth: 0 }}>
                <MetricsCountTable
                  categories={metricCategories}
                  isLoading={loading}
                />
              </Box>
            </Flex>
          </Paper>
        </Stack>
      </Container>
    );
  };
  
  export default ResearchMetricsWrapper;