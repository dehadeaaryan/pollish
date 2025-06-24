import json
from service import get_background_service

def lambda_handler(event, context):
    try:
        query_params = event.get("queryStringParameters") or {}
        pollish_id = query_params.get("pollish_id")

        if not pollish_id:
            raise ValueError("pollish_id query parameter is required")

        background = get_background_service(pollish_id)

        if not background:
            return {
                "statusCode": 404,
                "body": json.dumps({"message": "No background found"}),
                "headers": standard_headers(),
            }

        return {
            "statusCode": 200,
            "body": json.dumps(background),
            "headers": standard_headers(),
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)}),
            "headers": standard_headers(),
        }

def standard_headers():
    return {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
    }
