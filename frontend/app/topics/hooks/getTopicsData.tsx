import { WorksFilterState, TopicDataPoint } from "@/libs/types";

// Type for year keys including special case '9999' for all years
type YearKey = '9999' | string;

export interface TopicsResponse {
  data: Record<YearKey, TopicDataPoint[]>;
}

export const fetchTopicsData = async (filters: WorksFilterState): Promise<TopicsResponse> => {
  const host = process.env.NEXT_PUBLIC_HOST;
  
  if (!host) {
    throw new Error('NEXT_PUBLIC_HOST environment variable is not defined');
  }

  const response = await fetch(
    `${host}/works/dimensions/topics?filter=${encodeURIComponent(JSON.stringify(filters))}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to fetch topics data: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  // Transform the data to match the expected interface
  const rawData = await response.json();
  const transformedData: TopicsResponse = {
    data: Object.fromEntries(
      Object.entries(rawData.data).map(([year, topics]) => [
        year,
        (topics as TopicDataPoint[]).map(topic => ({
          concept: topic.concept,
          publication_count: topic.publication_count,
          avg_citations: topic.avg_citations,
          collaborating_countries: String(topic.collaborating_countries), // Convert to string
          top_journals: topic.top_journals,
          year: topic.year
        }))
      ])
    )
  };

  return transformedData;
};