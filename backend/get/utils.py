from datetime import datetime

def format_timestamp_iso8601(unix_ts: int) -> str:
    return datetime.utcfromtimestamp(unix_ts).isoformat() + "Z"
