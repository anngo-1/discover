export const sortOptions = [
    { value: 'citations_count', label: 'Citation Count' },
    { value: 'date_normal', label: 'Publication Date' },
    { value: 'metrics.field_citation_ratio', label: 'Field Citation Ratio' },
    { value: 'metrics.relative_citation_ratio', label: 'Relative Citation Ratio' }
];

export const publicationTypes = [
    { value: 'RESEARCH_ARTICLE', label: 'Research Article' },
    { value: 'REVIEW_ARTICLE', label: 'Review Article' },
    { value: 'RESEARCH_CHAPTER', label: 'Research Chapter' },
    { value: 'CONFERENCE_PAPER', label: 'Conference Paper' },
    { value: 'CONFERENCE_ABSTRACT', label: 'Conference Abstract' },
    { value: 'REFERENCE_WORK', label: 'Reference Work' },
    { value: 'LETTER_TO_EDITOR', label: 'Letter to Editor' },
    { value: 'EDITORIAL', label: 'Editorial' },
    { value: 'BOOK_REVIEW', label: 'Book Review' },
    { value: 'CORRECTION_ERRATUM', label: 'Correction/Erratum' }
];

export const fieldOptions = [
    { value: 'Biomedical and Clinical Sciences', label: 'Biomedical and Clinical Sciences' },
    { value: 'Health Sciences', label: 'Health Sciences' },
    { value: 'Information and Computing Sciences', label: 'Information and Computing Sciences' },
    { value: 'Commerce, Management, Tourism and Services', label: 'Commerce, Management, Tourism and Services' },
    { value: 'Human Society', label: 'Human Society' },
    { value: 'Biological Sciences', label: 'Biological Sciences' },
    { value: 'Education', label: 'Education' },
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Psychology', label: 'Psychology' },
    { value: 'Economics', label: 'Economics' },
    { value: 'Language, Communication and Culture', label: 'Language, Communication and Culture' },
    { value: 'Law and Legal Studies', label: 'Law and Legal Studies' },
    { value: 'Chemical Sciences', label: 'Chemical Sciences' },
    { value: 'Philosophy and Religious Studies', label: 'Philosophy and Religious Studies' },
    { value: 'Creative Arts and Writing', label: 'Creative Arts and Writing' },
    { value: 'Earth Sciences', label: 'Earth Sciences' },
    { value: 'Environmental Sciences', label: 'Environmental Sciences' },
    { value: 'Built Environment and Design', label: 'Built Environment and Design' },
    { value: 'Agricultural, Veterinary and Food Sciences', label: 'Agricultural, Veterinary and Food Sciences' },
    { value: 'Mathematical Sciences', label: 'Mathematical Sciences' },
    { value: 'Physical Sciences', label: 'Physical Sciences' },
    { value: 'History, Heritage and Archaeology', label: 'History, Heritage and Archaeology' }
];

export const journalListOptions = [
    { value: 'PubMed', label: 'PubMed' },
    { value: 'DOAJ', label: 'DOAJ (Open Access)' },
    { value: 'Nature Index journals', label: 'Nature Index' },
    { value: 'ERA 2023', label: 'ERA 2023' },
    { value: 'Norwegian register level 1', label: 'Norwegian Register (Level 1)' },
    { value: 'Norwegian register level 2', label: 'Norwegian Register (Level 2)' },
    { value: 'ERIH PLUS', label: 'ERIH PLUS' },
    { value: 'SciELO', label: 'SciELO' }
];

interface OrganizationGroup {
    group: string;
    items: {
        value: string;
        label: string;
        description: string;
    }[];
}

export const organizationOptions: OrganizationGroup[] = [
    {
        group: 'Main Institution',
        items: [
            {
                value: 'grid.266100.3',
                label: 'University of California, San Diego',
                description: 'San Diego, United States'
            }
        ]
    },
    {
        group: 'University of California System',
        items: [
            {
                value: 'grid.30389.31',
                label: 'University of California System',
                description: 'Oakland, United States'
            }
        ]
    },
    {
        group: 'Child Organizations',
        items: [
            {
                value: 'grid.217200.6',
                label: 'Scripps Institution of Oceanography',
                description: 'La Jolla, United States'
            },
            {
                value: 'grid.516081.b',
                label: 'Moores Comprehensive Cancer Center',
                description: 'La Jolla, United States'
            },
            {
                value: 'grid.468305.c',
                label: 'California Space Grant Consortium',
                description: 'La Jolla, United States'
            },
            {
                value: 'grid.454017.3',
                label: 'California Sea Grant',
                description: 'Eureka, United States'
            },
            {
                value: 'grid.419957.7',
                label: 'San Diego Supercomputer Center',
                description: 'San Diego, United States'
            }
        ]
    },
    {
        group: 'Related Organizations',
        items: [
            {
                value: 'grid.214007.0',
                label: 'Scripps Research Institute',
                description: 'San Diego, United States'
            },
            {
                value: 'grid.250671.7',
                label: 'Salk Institute for Biological Studies',
                description: 'La Jolla, United States'
            },
            {
                value: 'grid.410371.0',
                label: 'VA San Diego Healthcare System',
                description: 'San Diego, United States'
            },
            {
                value: 'grid.286440.c',
                label: "Rady Children's Hospital-San Diego",
                description: 'San Diego, United States'
            },
            {
                value: 'grid.413086.8',
                label: 'University of California San Diego Medical Center',
                description: 'San Diego, United States'
            }
        ]
    }
];