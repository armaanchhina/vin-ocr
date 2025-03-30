from common.db import remove_connection

import logging
from common.db import remove_connection

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    try:
        connection_id = event["requestContext"]["connectionId"]
        logger.info(f"Disconnect triggered — Connection ID: {connection_id}")

        success = remove_connection(connection_id)
        if success:
            logger.info(f"Removed connection {connection_id} from database")
        else:
            logger.warning(f"Connection {connection_id} not found or already removed")

        return {
            "statusCode": 200,
            "body": "Disconnected successfully"
        }

    except KeyError:
        logger.error("connectionId missing from requestContext")
        return {
            "statusCode": 400,
            "body": "Invalid disconnect event"
        }

    except Exception as e:
        logger.error(f"Unexpected error on disconnect: {type(e).__name__} — {str(e)}")
        return {
            "statusCode": 500,
            "body": "Internal server error during disconnect"
        }

