import json
from service import say_hello

def lambda_handler(event, context):
    try:
        name = event.get("queryStringParameters", {}).get("name", "World")
        response = say_hello(name)
        return {
            "statusCode": 200,
            "body": json.dumps({"message": response}),
            "headers": {"Content-Type": "application/json"}
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)}),
            "headers": {"Content-Type": "application/json"}
        }
