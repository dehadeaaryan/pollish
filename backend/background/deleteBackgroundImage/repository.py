import boto3

s3 = boto3.client("s3")
BUCKET_NAME = "pollish-bucket"

def delete_background_files(pollish_id: str):
    prefix = f"{pollish_id}/background"
    deleted_keys = []

    response = s3.list_objects_v2(Bucket=BUCKET_NAME, Prefix=prefix)

    if "Contents" in response:
        for obj in response["Contents"]:
            s3.delete_object(Bucket=BUCKET_NAME, Key=obj["Key"])
            deleted_keys.append(obj["Key"])

    return deleted_keys
