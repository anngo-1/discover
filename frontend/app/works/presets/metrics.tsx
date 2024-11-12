import { MetricsData } from "@/libs/types";

export const TestMetrics: MetricsData = {
  totalPapers: 12000,
  totalCitations: 8000,
  averageCitations: 20000,
  timeSeriesData: [
    {
        period: "2013", total_results: 4000, total_citations: 2500,
        year: undefined
    },
    {
        period: "2014", total_results: 4200, total_citations: 2700,
        year: undefined
    },
    {
        period: "2015", total_results: 4500, total_citations: 2900,
        year: undefined
    },
    {
        period: "2016", total_results: 4800, total_citations: 3100,
        year: undefined
    },
    {
        period: "2017", total_results: 5000, total_citations: 3200,
        year: undefined
    },
    {
        period: "2018", total_results: 5500, total_citations: 3400,
        year: undefined
    },
    {
        period: "2019", total_results: 6000, total_citations: 3600,
        year: undefined
    },
    {
        period: "2020", total_results: 6500, total_citations: 3800,
        year: undefined
    },
    {
        period: "2021", total_results: 7000, total_citations: 4000,
        year: undefined
    },
    {
        period: "2022", total_results: 7500, total_citations: 4200,
        year: undefined
    },
  ],
  stackedData: [
    {
        period: "2020", articles: 5000, preprints: 300, datasets: 100, other: 100,
        year: undefined
    },
    {
        period: "2021", articles: 6000, preprints: 500, datasets: 150, other: 150,
        year: undefined
    },
    {
        period: "2022", articles: 7000, preprints: 600, datasets: 200, other: 200,
        year: undefined
    },
    {
        period: "2023", articles: 7500, preprints: 700, datasets: 250, other: 250,
        year: undefined
    },
    {
        period: "2024", articles: 8000, preprints: 800, datasets: 300, other: 300,
        year: undefined
    },
    {
        period: "2025", articles: 8500, preprints: 900, datasets: 350, other: 350,
        year: undefined
    },
    {
        period: "2026", articles: 9000, preprints: 1000, datasets: 400, other: 400,
        year: undefined
    },
    {
        period: "2027", articles: 9500, preprints: 1100, datasets: 450, other: 450,
        year: undefined
    },
    {
        period: "2028", articles: 10000, preprints: 1200, datasets: 500, other: 500,
        year: undefined
    },
    {
        period: "2029", articles: 10500, preprints: 1300, datasets: 550, other: 550,
        year: undefined
    },
  ],
  publishers: [
    { name: "Elsevier", count: 3240 },
    { name: "Springer Nature", count: 2850 },
    { name: "Wiley", count: 2450 },
    { name: "IEEE", count: 1980 },
    { name: "Taylor & Francis", count: 1650 },
  ],
  funders: [
    { name: "National Science Foundation", count: 2100 },
    { name: "National Institutes of Health", count: 1890 },
    { name: "European Research Council", count: 1560 },
    { name: "Wellcome Trust", count: 980 },
    { name: "Gates Foundation", count: 760 },
  ],
  openAccess: [
    { name: "Non-Open Access", count: 8500 },
    { name: "Open Access", count: 3500 },
  ]
};
