# reverse the FIELDS_MAPPING dictionary to map field names to IDs
FIELDS_MAPPING = {11: ['Agricultural and Biological Sciences'], 12: ['Arts and Humanities'], 13: ['Biochemistry, Genetics and Molecular Biology'], 14: ['Business, Management and Accounting'], 15: ['Chemical Engineering'], 16: ['Chemistry'], 17: ['Computer Science'], 18: ['Decision Sciences'], 19: ['Earth and Planetary Sciences'], 20: ['Economics, Econometrics and Finance'], 21: ['Energy'], 22: ['Engineering'], 23: ['Environmental Science'], 24: ['Immunology and Microbiology'], 25: ['Materials Science'], 26: ['Mathematics'], 27: ['Medicine'], 28: ['Neuroscience'], 29: ['Nursing'], 30: ['Pharmacology, Toxicology and Pharmaceutics'], 31: ['Physics and Astronomy'], 32: ['Psychology'], 33: ['Social Sciences'], 34: ['Veterinary'], 35: ['Dentistry'], 36: ['Health Professions']}
FIELDS_MAPPING_REVERSED = {v[0]: k for k, v in FIELDS_MAPPING.items()}

def generate_filter_strings(filter):
    sort_list = filter.get('sort') or []
    if filter.get('search_query') and 'relevance_score:desc' not in sort_list:
        sort_list.insert(0, 'relevance_score:desc')
    sort_string = ",".join(sort_list)

    filter_components = []
    date_from = filter.get('dateRange', {}).get('from')
    if date_from:
        date_from = date_from.split("T")[0]
        filter_components.append(f"from_publication_date:{date_from}")

    date_to = filter.get('dateRange', {}).get('to')
    if date_to:
        date_to = date_to.split("T")[0]
        filter_components.append(f"to_publication_date:{date_to}")

    # map field names to IDs and construct field strings
    field_names = filter.get('fields') or []

    field_ids = [str(FIELDS_MAPPING_REVERSED.get(field_name, field_name)) for field_name in field_names]
    field_string = "|".join(field_ids)
    if field_string:
        filter_components.append("topics.field.id:" + field_string)

    # map excludeField names to IDs and construct exclude field strings
    exclude_field_names = filter.get('excludeFields') or []
    exclude_field_ids = [str(FIELDS_MAPPING_REVERSED.get(field_name, field_name)) for field_name in exclude_field_names]
    exclude_field_string = "|".join(exclude_field_ids)
    if exclude_field_string:
        filter_components.append("topics.field.id:!" + exclude_field_string)

    # construct type strings only if not empty
    type_list = filter.get('type') or []
    type_string = "|".join(type_list)
    if type_string:
        filter_components.append("type:" + type_string)

    # construct citation count strings only if values are not None
    citation_count_min = filter.get('citationCount', {}).get('min')
    if citation_count_min is not None:
        filter_components.append(f"cited_by_count:>{citation_count_min}")

    citation_count_max = filter.get('citationCount', {}).get('max')
    if citation_count_max is not None:
        filter_components.append(f"cited_by_count:<{citation_count_max}")

    # construct DOI and Open Access strings, and search query only if present
    if filter.get('has_doi'):
        filter_components.append("has_doi:true")
    if filter.get('openAccess'):
        filter_components.append("is_oa:true")
    if filter.get('search_query'):
        filter_components.append(f"default.search:{filter.get('search_query')}")

    # return dictionary with sort and filter strings
    return {
        "sort": sort_string,
        "filter": ','.join(filter_components)
    }
