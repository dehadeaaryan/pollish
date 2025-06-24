from repository import remove_card_from_pollish, delete_card_image_from_s3

def delete_card_service(pollish_id: str, card_id: str):
    # 1. Remove card from DynamoDB
    removed_card = remove_card_from_pollish(pollish_id, card_id)

    if not removed_card:
        raise ValueError("Card not found in pollish")

    # 2. Delete image from S3
    delete_card_image_from_s3(pollish_id, card_id)
