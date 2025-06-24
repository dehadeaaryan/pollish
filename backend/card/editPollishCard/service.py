from repository import update_card_in_pollish, generate_presigned_upload_url, get_extension

def edit_card_service(pollish_id: str, card_id: str, title: str, image_type: str = None):
    # Update card title in DB
    update_card_in_pollish(pollish_id, card_id, title)

    result = {"message": "Card updated"}

    # Generate presigned URL if image_type is valid
    if image_type:
        ext = get_extension(image_type)
        if ext:
            key = f"{pollish_id}/{card_id}{ext}"
            upload_url = generate_presigned_upload_url("pollish-bucket", key, image_type)
            result["upload_url"] = upload_url
            result["image_key"] = key

    return result
