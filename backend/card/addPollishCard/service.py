import uuid
from repository import append_card_to_pollish

def create_card_service(pollish_id: str, title: str, value: int) -> dict:
    card_id = str(uuid.uuid4())

    card = {
        "id": card_id,
        "title": title,
        "value": value
    }

    append_card_to_pollish(pollish_id, card)
    return card
