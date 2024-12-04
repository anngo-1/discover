import { JournalFilterState } from "@/libs/types";

export const initialFilters: JournalFilterState = {
    dateRange: {
        from: new Date('2023-01-01'),
        to: new Date('2024-12-31')
    },
    search_query: "",
    type: ['RESEARCH_ARTICLE'],
    excludeTypes: [],
    fields: [],
    excludeFields: [],
    openAccess: false,
    has_doi: false,
    citationCount: {
        min: 0,
        max: null
    },
    sort: ['citations_count:desc', 'date_normal:desc'],
    author: '',
    organizations: {
        research: ['grid.266100.3'], // UCSD
        funding: [],
        excludeResearch: [],
        excludeFunding: []
    }
};

export const journalPredefinedFilters = [
    {
        name: 'Default Filter',
        filters:initialFilters
    },
    {
        name: 'High Impact Journals/Publishers',
        filters: {
            ...initialFilters,
            type: ['RESEARCH_ARTICLE', 'REVIEW_ARTICLE'],
            dateRange: { from: new Date('2023-01-01'), to: new Date('2024-12-31') },
            citationCount: { min: 20, max: null },
            has_doi: true,
            sort: ['citations_count:desc']
        }
    },
    {
        name: 'Computer Science Journals/Publishers',
        filters: {
            ...initialFilters,
            type: ['RESEARCH_ARTICLE', 'CONFERENCE_PAPER'],
            fields: ['Information and Computing Sciences'],
            dateRange: { from: new Date('2023-01-01'), to: new Date('2024-12-31') }
        }
    },
    {
        name: 'Medical Research Journals/Publishers',
        filters: {
            ...initialFilters,
            fields: ['Health Sciences', 'Clinical Sciences'],
            type: ['RESEARCH_ARTICLE', 'CLINICAL_TRIAL'],
            dateRange: { from: new Date('2023-01-01'), to: new Date('2024-12-31') }
        }
    },
    {
        name: 'Biology Research Journals/Publishers',
        filters: {
            ...initialFilters,
            fields: ['Biological Sciences'],
            type: ['RESEARCH_ARTICLE', 'REVIEW_ARTICLE'],
            dateRange: { from: new Date('2023-01-01'), to: new Date('2024-12-31') }
        }
    },
    {
        name: 'Physics & Engineering Journals/Publishers',
        filters: {
            ...initialFilters,
            fields: ['Physical Sciences', 'Engineering'],
            type: ['RESEARCH_ARTICLE', 'CONFERENCE_PAPER'],
            dateRange: { from: new Date('2023-01-01'), to: new Date('2024-12-31') }
        }
    },


    {
        name: 'NIH Funded Research Journals/Publishers',
        filters: {
            ...initialFilters,
            type: ['RESEARCH_ARTICLE'],
            dateRange: { from: new Date('2023-01-01'), to: new Date('2024-12-31') },
            organizations: {
                ...initialFilters.organizations,
                funding: ['grid.94365.3d'] // NIH GRID ID
            }
        }
    },
    {
        name: 'Climate & Environmental Research Journals/Publishers',
        filters: {
            ...initialFilters,
            fields: ['Environmental Sciences', 'Earth Sciences'],
            search_query: "climate OR environmental OR sustainability",
            dateRange: { from: new Date('2023-01-01'), to: new Date('2024-12-31') }
        }
    },
    {
        name: 'Social Sciences Research Journals/Publishers',
        filters: {
            ...initialFilters,
            fields: ['Social and Behavioural Sciences', 'Psychology'],
            type: ['RESEARCH_ARTICLE'],
            dateRange: { from: new Date('2023-01-01'), to: new Date('2024-12-31') }
        }
    }
];