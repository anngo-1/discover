import { JournalFilterState } from '@/libs/types';

const defaultJournalFilters: JournalFilterState = {
    dateRange: {
        from: new Date(0),
        to: new Date()
    },
    journalLists: [],
    search_query: '',
    citationMetrics: {
        minImpactFactor: null,
        minCiteScore: null,
        minHIndex: null,
        minCitations: null,
        maxCitations: null,
        minFieldCitationRatio: null,
        minRelativeCitationRatio: null
    },
    publisherFilters: {
        publishers: [],
        excludePublishers: []
    },
    accessType: {
        openAccess: false,
        subscription: false,
        hybrid: false
    },
    subjectAreas: [],
    publicationFrequency: {
        minArticlesPerYear: null,
        maxArticlesPerYear: null
    },
    sort: ['citations_count:desc'],
    organizations: {
        research: ['grid.266100.3'], 
        funding: []
    },
    documentTypes: {
        include: [],
        exclude: []
    },
    preprints: {
        include: true,
        exclude: false,
        only: false
    }
};

export const journalPredefinedFilters = [
    {
        name: "All Time",
        filters: defaultJournalFilters
    },
    {
        name: "High Impact",
        filters: {
            ...defaultJournalFilters,
            citationMetrics: {
                minImpactFactor: 5,
                minCiteScore: 5,
                minHIndex: 50,
                minCitations: 100,
                maxCitations: null,
                minFieldCitationRatio: 2.0,
                minRelativeCitationRatio: 2.0
            },
            journalLists: ['SCI', 'SCIE'],
            documentTypes: {
                include: ['RESEARCH_ARTICLE', 'REVIEW_ARTICLE'],
                exclude: []
            },
            preprints: {
                include: false,
                exclude: true,
                only: false
            },
            sort: ['metrics.field_citation_ratio:desc', 'citations_count:desc']
        }
    },
    {
        name: "Open Access Only",
        filters: {
            ...defaultJournalFilters,
            accessType: {
                openAccess: true,
                subscription: false,
                hybrid: false
            },
            journalLists: ['DOAJ'],
            publisherFilters: {
                publishers: [],
                excludePublishers: ['Research Square Platform', 'Cold Spring Harbor Laboratory'] // Excluding preprint servers
            },
            preprints: {
                include: false,
                exclude: true,
                only: false
            }
        }
    },
    {
        name: "Last 5 Years",
        filters: {
            ...defaultJournalFilters,
            dateRange: {
                from: new Date(new Date().setFullYear(new Date().getFullYear() - 5)),
                to: new Date()
            }
        }
    },
    {
        name: "Core Research Journals",
        filters: {
            ...defaultJournalFilters,
            documentTypes: {
                include: ['RESEARCH_ARTICLE', 'REVIEW_ARTICLE'],
                exclude: ['EDITORIAL', 'LETTER_TO_EDITOR', 'CONFERENCE_ABSTRACT', 'BOOK_REVIEW']
            },
            preprints: {
                include: false,
                exclude: true,
                only: false
            },
            publisherFilters: {
                publishers: ['Elsevier', 'Springer Nature', 'Wiley', 'Oxford University Press (OUP)', 'Taylor & Francis'],
                excludePublishers: []
            },
            journalLists: ['SCI', 'SCIE', 'SSCI'],
            citationMetrics: {
                minImpactFactor: 1,
                minCiteScore: 1,
                minHIndex: 20,
                minCitations: null,
                maxCitations: null,
                minFieldCitationRatio: 0.8,
                minRelativeCitationRatio: 0.8
            }
        }
    },
    {
        name: "Emerging Research",
        filters: {
            ...defaultJournalFilters,
            dateRange: {
                from: new Date(new Date().setFullYear(new Date().getFullYear() - 2)),
                to: new Date()
            },
            journalLists: ['ESCI'],
            citationMetrics: {
                minImpactFactor: null,
                minCiteScore: null,
                minHIndex: null,
                minCitations: 1,
                maxCitations: null,
                minFieldCitationRatio: 0.5,
                minRelativeCitationRatio: 0.5
            },
            documentTypes: {
                include: ['RESEARCH_ARTICLE'],
                exclude: []
            },
            sort: ['date_normal:desc', 'citations_count:desc']
        }
    },
    {
        name: "Preprints Only",
        filters: {
            ...defaultJournalFilters,
            preprints: {
                include: true,
                exclude: false,
                only: true
            },
            publisherFilters: {
                publishers: ['Cold Spring Harbor Laboratory', 'Research Square Platform'],
                excludePublishers: []
            },
            sort: ['date_normal:desc']
        }
    }
];