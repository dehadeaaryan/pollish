import json
from service import create_card_service

def lambda_handler(event, context):
    try:
        body = json.loads(event.get("body", "{}"))
        pollish_id = body.get("pollish_id")
        title = body.get("title")
        value = body.get("value")

        if not pollish_id or not title or value is None:
            raise ValueError("Missing required fields: pollish_id, title, value")

        card = create_card_service(pollish_id, title, value)

        return {
            "statusCode": 201,
            "body": json.dumps({"card": card}),
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
