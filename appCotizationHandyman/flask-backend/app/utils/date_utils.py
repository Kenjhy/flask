from datetime import datetime

"""Safely parses a date string to a datetime object."""
def parse_date(date_str):
    if date_str is None:
        return None
    try:
        return datetime.strptime(date_str, '%Y-%m-%d')
    except ValueError:
        return None

"""Safely parses a datetime string to a datetime object including time with timezone."""
def parse_datetime(datetime_str):
    if datetime_str is None:
        return None
    try:
        return datetime.fromisoformat(datetime_str) # Parse the datetime string to include the timezone information if present
    except ValueError:
        return None
