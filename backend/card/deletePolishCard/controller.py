import json
from service import delete_card_service

def lambda_handler(event, context):
    try:
        body = json.loads(event.get("body", "{}"))
        pollish_id = body.get("pollish_id")
        card_id = body.get("card_id")

        if not pollish_id or not card_id:
            raise ValueError("Missing required fields: pollish_id, card_id")

        delete_card_service(pollish_id, card_id)

        return {
            "statusCode": 200,
            "body": json.dumps({"message": "Card deleted"}),
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
