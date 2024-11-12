# Optimized date sanitization function
from datetime import datetime

def sanitize_date(date_str):
    try:
        return datetime.strptime(date_str.split('T')[0], "%Y-%m-%d").strftime("%Y-%m-%d")
    except (ValueError, AttributeError, TypeError):
        return None

# Optimized scale determination function
def determine_scale(date_from, date_to, user_specified_scale=None):
    date_from = sanitize_date(date_from)
    date_to = sanitize_date(date_to)
    
    if user_specified_scale and user_specified_scale == 'quarterly':
        return 'quarterly'
    
    # Default to yearly if scale is not specified or not quarterly
    return 'yearly'

# Optimized quarter date generator
def get_quarter_dates(year, quarter):
    quarter_starts = {
        1: (1, 1),  # Q1: Jan 1
        2: (4, 1),  # Q2: Apr 1
        3: (7, 1),  # Q3: Jul 1
        4: (10, 1)  # Q4: Oct 1
    }
    
    start_month, start_day = quarter_starts[quarter]
    start_date = datetime(year, start_month, start_day)
    end_date = datetime(year + 1, 1, 1) - datetime.timedelta(days=1) if quarter == 4 else datetime(year, start_month + 3, 1) - datetime.timedelta(days=1)
    
    return start_date, end_date


def generate_filters(date_from, date_to, scale):
    date_from = sanitize_date(date_from)
    date_to = sanitize_date(date_to)

    start_date = datetime.strptime(date_from, "%Y-%m-%d") if date_from else datetime.today().replace(year=datetime.today().year - 20, month=1, day=1)
    end_date = datetime.strptime(date_to, "%Y-%m-%d") if date_to else datetime.today()

    filters = []
    current_year = start_date.year
    current_quarter = (start_date.month - 1) // 3 + 1

    if scale == 'quarterly':
        while current_year < end_date.year or (current_year == end_date.year and current_quarter <= (end_date.month - 1) // 3 + 1):
            quarter_start, quarter_end = get_quarter_dates(current_year, current_quarter)
            filters.append({
                'from': quarter_start.strftime("%Y-%m-%d"),
                'to': quarter_end.strftime("%Y-%m-%d"),
                'display': f"{current_year} Q{current_quarter}"
            })
            current_quarter = 1 if current_quarter == 4 else current_quarter + 1
            if current_quarter == 1:
                current_year += 1
    else:  # yearly scale (default behavior)
        for year in range(start_date.year, end_date.year + 1):
            year_start = datetime(year, 1, 1)
            year_end = datetime(year, 12, 31)
            filters.append({
                'from': year_start.strftime("%Y-%m-%d"),
                'to': year_end.strftime("%Y-%m-%d")
            })

    return filters