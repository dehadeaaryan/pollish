from repository import get_pollish_by_id
from utils import format_timestamp_iso8601

def fetch_pollish(pollish_id: str) -> dict:
    pollish = get_pollish_by_id(pollish_id)

    if not pollish:
        raise ValueError("Pollish not found")

    # Optional: format created_at timestamp
    if "created_at" in pollish:
        pollish["created_at"] = format_timestamp_iso8601(pollish["created_at"])

    return pollish
