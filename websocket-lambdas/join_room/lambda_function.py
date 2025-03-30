import json
import logging
from common.db import save_connection

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    try:
        connection_id = event["requestContext"]["connectionId"]
        logger.info(f"Connection request received — ID: {connection_id}")

        try:
            body = json.loads(event.get("body") or "{}")
        except json.JSONDecodeError:
            logger.error("Malformed JSON in request body")
            return {
                "statusCode": 400,
                "body": "Malformed JSON"
            }

        room_key = body.get("roomKey")
        if not room_key:
            logger.warning(f"⚠️ No roomKey provided by connection {connection_id}")
            return {
                "statusCode": 400,
                "body": "Missing roomKey"
            }

        save_connection(room_key, connection_id)
        logger.info(f"Connection {connection_id} joined room {room_key}")

        return {
            "statusCode": 200,
            "body": f"Joined room {room_key}"
        }

    except KeyError:
        logger.error("requestContext or connectionId missing from event")
        return {
            "statusCode": 400,
            "body": "Invalid connection request"
        }

    except Exception as e:
        logger.error(f"Unexpected error in joinRoom: {type(e).__name__} — {str(e)}")
        return {
            "statusCode": 500,
            "body": "Internal server error while joining room"
        }

