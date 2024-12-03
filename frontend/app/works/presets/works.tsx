import { WorksFilterState } from "@/libs/types";

export const initialFilters: WorksFilterState = {
    dateRange: {
        from: new Date('2023-01-01'),
        to: new Date('2024-12-31')
    },
    search_query: "",
    type: ['RESEARCH_ARTICLE'],
    fields: [],
    excludeFields: [],
    openAccess: false,
    has_doi: false,
    citationCount: {
        min: 0,
        max: null,
    },
    subject: "works",
    sort: ['citations_count:desc', 'date_normal:desc'],
    authors: [],
    metrics: {
        fieldCitationRatio: {
            min: null,
            max: null,
        },
        relativeCitationRatio: {
            min: null,
            max: null,
        }
    },
    organizations: {
        research: ['grid.266100.3'],  // UCSD GRID ID
        funding: [],
    },
    countries: {
        research: [],
        funding: [],
    },
    publicationIds: {},
    hasFullText: false,
    documentType: {
        classification: 'RESEARCH_ARTICLE',
        isCitable: true
    },
    journalLists: [],
    concepts: {
        terms: [],
        minRelevance: 0.5
    }
};

export const worksPredefinedFilters = [
    {
        name: 'High Impact Papers (Last 2 Years)',
        filters: {
            ...initialFilters,
            type: ['RESEARCH_ARTICLE', 'REVIEW_ARTICLE'],
            dateRange: { from: new Date('2022-01-01'), to: new Date('2024-12-31') },
            metrics: {
                fieldCitationRatio: {
                    min: 2.0,
                    max: null
                },
                relativeCitationRatio: {
                    min: null,
                    max: null
                }
            },
            has_doi: true,
            sort: ['metrics.field_citation_ratio:desc', 'citations_count:desc'],
            documentType: {
                classification: 'RESEARCH_ARTICLE',
                isCitable: true
            },
            organizations: {
                research: ['grid.266100.3'],  // UCSD GRID ID
                funding: [],
            }
        }
    },
    {
        name: 'Computer Science & AI Research',
        filters: {
            ...initialFilters,
            type: ['RESEARCH_ARTICLE', 'CONFERENCE_PAPER'],
            fields: ['Information and Computing Sciences'],
            search_query: "artificial intelligence OR machine learning OR deep learning",
            dateRange: { from: new Date('2023-01-01'), to: new Date('2024-12-31') },
            has_doi: true,
            sort: ['citations_count:desc', 'date_normal:desc'],
            concepts: {
                terms: ['artificial intelligence', 'machine learning', 'deep learning'],
                minRelevance: 0.7
            },
            documentType: {
                classification: 'RESEARCH_ARTICLE',
                isCitable: true
            },
            organizations: {
                research: ['grid.266100.3'],  // UCSD GRID ID
                funding: [],
            }
        }
    },
    {
        name: 'Open Access Mathematics Research',
        filters: {
            ...initialFilters,
            type: ['RESEARCH_ARTICLE'],
            fields: ['Mathematical Sciences'],
            openAccess: true,
            dateRange: { from: new Date('2020-01-01'), to: new Date('2024-12-31') },
            metrics: {
                fieldCitationRatio: {
                    min: 1.5,
                    max: null
                },
                relativeCitationRatio: {
                    min: 1.5,
                    max: null
                }
            },
            has_doi: true,
            documentType: {
                classification: 'RESEARCH_ARTICLE',
                isCitable: true
            },
            organizations: {
                research: ['grid.266100.3'],  // UCSD GRID ID
                funding: [],
            }
        }
    }
];