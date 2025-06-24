import boto3
import os

TABLE_NAME = os.environ.get("TABLE_NAME", "pollish-table")
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(TABLE_NAME)

def append_card_to_pollish(pollish_id: str, card: dict):
    table.update_item(
        Key={"id": pollish_id},
        UpdateExpression="SET cards = list_append(if_not_exists(cards, :empty_list), :new_card)",
        ExpressionAttributeValues={
            ":new_card": [card],
            ":empty_list": []
        },
        ReturnValues="UPDATED_NEW"
    )
