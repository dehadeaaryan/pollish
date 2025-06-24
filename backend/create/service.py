import uuid
import time
from repository import save_pollish_to_db

def create_pollish_service(poll_name: str) -> str:
    poll_id = str(uuid.uuid4())
    timestamp = int(time.time())

    item = {
        "id": poll_id,
        "name": poll_name,
        "created_at": timestamp,
        "background_url": None,
        "cards": []
    }

    save_pollish_to_db(item)
    return poll_id
