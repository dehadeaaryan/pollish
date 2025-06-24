import json
from service import delete_background_service

def lambda_handler(event, context):
    try:
        body = json.loads(event["body"])
        pollish_id = body["pollish_id"]

        deleted_keys = delete_background_service(pollish_id)

        return {
            "statusCode": 200,
            "body": json.dumps({"deleted": deleted_keys}),
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            },
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)}),
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            },
        }
