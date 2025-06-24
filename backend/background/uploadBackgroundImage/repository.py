import boto3

s3 = boto3.client("s3")
BUCKET_NAME = "pollish-bucket"

def generate_presigned_url(object_key: str, content_type: str):
    presigned_url = s3.generate_presigned_url(
        "put_object",
        Params={
            "Bucket": BUCKET_NAME,
            "Key": object_key,
            "ContentType": content_type,
        },
        ExpiresIn=300,
    )
    object_url = f"https://{BUCKET_NAME}.s3.amazonaws.com/{object_key}"
    return presigned_url, object_url

def delete_background_files(pollish_id: str):
    prefix = f"{pollish_id}/background"
    deleted_keys = []
    response = s3.list_objects_v2(Bucket=BUCKET_NAME, Prefix=prefix)

    if "Contents" in response:
        for obj in response["Contents"]:
            s3.delete_object(Bucket=BUCKET_NAME, Key=obj["Key"])
            deleted_keys.append(obj["Key"])

    return deleted_keys
