import boto3

dynamodb = boto3.resource("dynamodb")
TABLE_NAME = "pollish-table"
table = dynamodb.Table(TABLE_NAME)

def get_pollish_by_id(pollish_id: str) -> dict | None:
    response = table.get_item(Key={"id": pollish_id})
    return response.get("Item")
