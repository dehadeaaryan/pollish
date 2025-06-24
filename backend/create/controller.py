import json
from service import create_pollish_service

def lambda_handler(event, context):
    try:
        body = json.loads(event.get("body", "{}"))
        poll_name = body.get("poll_name")

        if not poll_name:
            raise ValueError("Missing required field: poll_name")

        poll_id = create_pollish_service(poll_name)

        return {
            "statusCode": 201,
            "body": json.dumps({"poll_id": poll_id}),
            "headers": {"Content-Type": "application/json"}
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)}),
            "headers": {"Content-Type": "application/json"}
        }
