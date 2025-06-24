import json
import boto3
import os
import uuid

s3 = boto3.client("s3")
BUCKET_NAME = "pollish-assets"

def lambda_handler(event, context):
    try:
        body = json.loads(event["body"])
        pollish_id = body["pollish_id"]
        filename = body["filename"]  # e.g. "background.jpg" or "card_abc123.png"
        content_type = body.get("content_type", "image/jpeg")  # default to jpeg

        # Construct S3 object key (folder + filename)
        object_key = f"{pollish_id}/{filename}"

        # Generate presigned URL (valid for 5 minutes)
        presigned_url = s3.generate_presigned_url(
            "put_object",
            Params={
                "Bucket": BUCKET_NAME,
                "Key": object_key,
                "ContentType": content_type,
            },
            ExpiresIn=300,  # 5 minutes
        )

        return {
            "statusCode": 200,
            "body": json.dumps({
                "upload_url": presigned_url,
                "object_url": f"https://{BUCKET_NAME}.s3.amazonaws.com/{object_key}"
            }),
            "headers": {
                "Content-Type": "application/json"
            }
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)}),
            "headers": {
                "Content-Type": "application/json"
            }
        }
