import boto3
import os

TABLE_NAME = os.environ.get("TABLE_NAME", "pollish-table")
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(TABLE_NAME)

s3_client = boto3.client("s3")

def update_card_in_pollish(pollish_id: str, card_id: str, new_title: str):
    # Get pollish data
    response = table.get_item(Key={"id": pollish_id})
    item = response.get("Item")
    if not item or "cards" not in item:
        raise ValueError("Pollish or cards not found")

    # Update card title
    cards = item["cards"]
    updated = False
    for card in cards:
        if card["id"] == card_id:
            card["title"] = new_title
            updated = True
            break

    if not updated:
        raise ValueError("Card not found in pollish")

    # Write back
    table.update_item(
        Key={"id": pollish_id},
        UpdateExpression="SET cards = :cards",
        ExpressionAttributeValues={":cards": cards}
    )

def get_extension(content_type: str) -> str:
    ext_map = {
        "image/jpeg": ".jpg",
        "image/png": ".png",
        "image/webp": ".webp"
    }
    return ext_map.get(content_type.lower(), "")

def generate_presigned_upload_url(bucket: str, key: str, content_type: str) -> str:
    return s3_client.generate_presigned_url(
        ClientMethod="put_object",
        Params={
            "Bucket": bucket,
            "Key": key,
            "ContentType": content_type
        },
        ExpiresIn=3600
    )
