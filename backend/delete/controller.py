import json
from service import delete_pollish_service

def lambda_handler(event, context):
    try:
        body = json.loads(event.get("body", "{}"))
        pollish_id = body.get("pollish_id")

        if not pollish_id:
            raise ValueError("Missing required field: pollish_id")

        delete_pollish_service(pollish_id)

        return {
            "statusCode": 200,
            "body": json.dumps({"message": "Pollish deleted successfully"}),
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST,OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            }
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)}),
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST,OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            }
        }
