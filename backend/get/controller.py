from service import fetch_pollish
import json

def get_pollish_controller(event):
    pollish_id = event.get("queryStringParameters", {}).get("id")

    if not pollish_id:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "Missing 'id' query parameter."}),
        }

    try:
        pollish = fetch_pollish(pollish_id)
        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",  # CORS
            },
            "body": json.dumps(pollish),
        }
    except ValueError as ve:
        return {
            "statusCode": 404,
            "body": json.dumps({"error": str(ve)}),
        }
    except Exception as e:
        print(f"Unexpected error: {e}")
        return {
            "statusCode": 500,
            "body": json.dumps({"error": "Internal server error"}),
        }
