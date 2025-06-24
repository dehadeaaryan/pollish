import boto3
import os

TABLE_NAME = os.environ.get("TABLE_NAME", "pollish-table")
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(TABLE_NAME)

def save_pollish_to_db(item: dict):
    table.put_item(Item=item)
