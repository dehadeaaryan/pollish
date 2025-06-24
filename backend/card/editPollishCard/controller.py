import json
from service import edit_card_service

def lambda_handler(event, context):
    try:
        body = json.loads(event.get("body", "{}"))
        pollish_id = body.get("pollish_id")
        card_id = body.get("card_id")
        title = body.get("title")
        image_type = body.get("image_type")  # Optional

        if not pollish_id or not card_id or not title:
            raise ValueError("Missing required fields: pollish_id, card_id, title")

        result = edit_card_service(pollish_id, card_id, title, image_type)

        return {
            "statusCode": 200,
            "body": json.dumps(result),
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
