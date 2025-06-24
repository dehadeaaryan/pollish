import boto3
import os
import fnmatch

TABLE_NAME = os.environ.get("TABLE_NAME", "pollish-table")
S3_BUCKET = os.environ.get("S3_BUCKET", "pollish-bucket")

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(TABLE_NAME)

s3_client = boto3.client("s3")

def remove_card_from_pollish(pollish_id: str, card_id: str):
    # Fetch pollish item
    response = table.get_item(Key={"id": pollish_id})
    item = response.get("Item")
    if not item or "cards" not in item:
        raise ValueError("Pollish or cards not found")

    # Find and remove the card
    cards = item["cards"]
    new_cards = [card for card in cards if card["id"] != card_id]
    if len(new_cards) == len(cards):
        return None  # Card not found

    # Update table
    table.update_item(
        Key={"id": pollish_id},
        UpdateExpression="SET cards = :cards",
        ExpressionAttributeValues={":cards": new_cards}
    )

    # Return removed card (optional)
    return next((card for card in cards if card["id"] == card_id), None)


def delete_card_image_from_s3(pollish_id: str, card_id: str):
    prefix = f"{pollish_id}/{card_id}"
    # List objects under this prefix
    response = s3_client.list_objects_v2(Bucket=S3_BUCKET, Prefix=prefix)

    if "Contents" not in response:
        return  # No matching files

    for obj in response["Contents"]:
        key = obj["Key"]
        # Match exact filename with any extension
        if fnmatch.fnmatch(key, f"{pollish_id}/{card_id}.*"):
            s3_client.delete_object(Bucket=S3_BUCKET, Key=key)
