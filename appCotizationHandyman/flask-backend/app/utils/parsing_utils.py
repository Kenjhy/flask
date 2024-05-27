"""Try to convert a value to float. Return a default value if the conversion fails."""
def safe_float(value, default=None):
    try:
        return float(value)
    except (TypeError, ValueError):
        return default
