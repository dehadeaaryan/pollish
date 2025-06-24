import boto3
import os

s3 = boto3.client("s3")
BUCKET_NAME = "pollish-bucket"
VALID_EXTENSIONS = ["jpg", "jpeg", "png", "webp"]

def get_background_image(pollish_id: str):
    prefix = f"{pollish_id}/"

    response = s3.list_objects_v2(Bucket=BUCKET_NAME, Prefix=prefix)

    if "Contents" not in response:
        return None

    for obj in response["Contents"]:
        key = obj["Key"]
        if key.startswith(prefix + "background.") and key[len(prefix + "background."):].find('/') == -1:
            if any(key.lower().endswith(f".{ext}") for ext in VALID_EXTENSIONS):
                url = s3.generate_presigned_url(
                    ClientMethod="get_object",
                    Params={"Bucket": BUCKET_NAME, "Key": key},
                    ExpiresIn=3600
                )
                return {"key": key, "url": url}

    return None
