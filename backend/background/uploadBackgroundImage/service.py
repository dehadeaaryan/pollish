from repository import delete_background_files, generate_presigned_url
from utils import get_extension

def upload_background_service(pollish_id: str, content_type: str):
    delete_background_files(pollish_id)

    extension = get_extension(content_type)
    object_key = f"{pollish_id}/background{extension}"

    presigned_url, object_url = generate_presigned_url(object_key, content_type)

    return {
        "upload_url": presigned_url,
        "object_url": object_url,
        "object_key": object_key,
    }
