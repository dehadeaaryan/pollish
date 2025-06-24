def get_extension(content_type: str) -> str:
    ext_map = {
        "image/jpeg": ".jpg",
        "image/png": ".png",
        "image/webp": ".webp"
    }
    return ext_map.get(content_type.lower(), "")
