import boto3
import os

TABLE_NAME = os.environ.get("TABLE_NAME", "pollish-table")
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(TABLE_NAME)

s3 = boto3.client("s3")

def delete_pollish_from_db(pollish_id: str):
    table.delete_item(Key={"id": pollish_id})

def delete_pollish_s3_directory(bucket: str, pollish_id: str):
    # List all objects under the directory
    paginator = s3.get_paginator('list_objects_v2')
    pages = paginator.paginate(Bucket=bucket, Prefix=f"{pollish_id}/")

    keys_to_delete = []
    for page in pages:
        for obj in page.get("Contents", []):
            keys_to_delete.append({'Key': obj['Key']})

    if keys_to_delete:
        # Delete in batches of 1000 (S3 limit)
        for i in range(0, len(keys_to_delete), 1000):
            s3.delete_objects(
                Bucket=bucket,
                Delete={'Objects': keys_to_delete[i:i+1000]}
            )
