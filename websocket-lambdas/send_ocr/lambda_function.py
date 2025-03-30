import json
import boto3
import re
import logging
from boto3.dynamodb.conditions import Key

logger = logging.getLogger()
logger.setLevel(logging.INFO)

VIN_REGEX = r'\b[A-HJ-NPR-Z0-9]{17}\b'

textract_client = boto3.client("textract")
s3 = boto3.client("s3")
dynamodb = boto3.resource("dynamodb")

# Replace this with your actual values
DDB_TABLE = "WebSocketRoomConnections"
WS_ENDPOINT = "https://8r0fliq78k.execute-api.us-west-2.amazonaws.com/staging"

table = dynamodb.Table(DDB_TABLE)
ws_client = boto3.client("apigatewaymanagementapi", endpoint_url=WS_ENDPOINT)

def lambda_handler(event, context):
    try:
        extracted_vins = []

        for record in event["Records"]:
            bucket_name = record["s3"]["bucket"]["name"]
            object_key = record["s3"]["object"]["key"]

            if not bucket_name or not object_key:
                raise ValueError("Missing bucket or object key in event.")

            logger.info(f"Processing image from S3: s3://{bucket_name}/{object_key}")

            # Get metadata (roomKey) from S3 object
            head = s3.head_object(Bucket=bucket_name, Key=object_key)
            room_key = head["Metadata"].get("roomkey")
            repair_info = head["Metadata"].get("repairinfo")

            logger.info(f"Room Key: {room_key}\n Repair Info {repair_info}")

            if not room_key:
                raise ValueError("roomKey metadata missing in uploaded object")

            # OCR using Textract
            response = textract_client.detect_document_text(
                Document={"S3Object": {"Bucket": bucket_name, "Name": object_key}}
            )

            if "Blocks" not in response:
                raise ValueError("Textract response missing 'Blocks' key")

            all_text = " ".join([item["Text"] for item in response["Blocks"] if "Text" in item])
            logger.info("Extracted Text: %s", all_text)

            vin_match = re.search(VIN_REGEX, all_text)
            vin_number = vin_match.group(0) if vin_match else None

            logger.info(f"VIN found: {vin_number}")
            extracted_vins.append({"file": object_key, "vin": vin_number})

            connections = table.query(
                KeyConditionExpression=Key("roomKey").eq(room_key)
            )["Items"]

            payload = {
                "roomKey": room_key,
                "vinNumber": vin_number,
                "repairInfo": repair_info
            }

            if not vin_number:
                payload["rawText"] = all_text
                payload["error"] = "VIN not found"

            for connection in connections:
                try:
                    ws_client.post_to_connection(
                        ConnectionId=connection["connectionId"],
                        Data=json.dumps(payload).encode("utf-8")
                    )
                except ws_client.exceptions.GoneException:
                    logger.warning(f"Stale connection, removing: {connection['connectionId']}")
                    table.delete_item(
                        Key={
                            "roomKey": room_key,
                            "connectionId": connection["connectionId"]
                        }
                    )

        return {
            "statusCode": 200,
            "body": json.dumps({"vin_data": extracted_vins})
        }

    except Exception as e:
        logger.error("Error: %s", str(e))
        return {
            "statusCode": 500,
            "body": json.dumps({"error": "Internal Server Error"})
        }

