import json
import boto3
import re
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

VIN_REGEX = r'\b[A-HJ-NPR-Z0-9]{17}\b' 

textract_client = boto3.client("textract")

def lambda_handler(event, context):
    """Extract text from a VIN sticker image in S3 using Textract, with logging and error handling."""
    try:
        extracted_vins = []

        for record in event["Records"]:
            bucket_name = record["s3"]["bucket"]["name"]
            object_key = record["s3"]["object"]["key"]
            
            if not bucket_name or not object_key:
                raise ValueError("Missing bucket or object key in event.")
            
            logger.info(f"Processing image from S3: s3://{bucket_name}/{object_key}")

            response = textract_client.detect_document_text(
                Document={"S3Object": {"Bucket": bucket_name, "Name": object_key}}
            )

            if "Blocks" not in response:
                raise ValueError("Textract response is missing 'Blocks' key.")

            all_text = " ".join([item["Text"] for item in response["Blocks"] if "Text" in item])

            logger.info("Extracted Text: %s", all_text)

            vin_match = re.search(VIN_REGEX, all_text)
            vin_number = vin_match.group(0) if vin_match else "VIN not found"

            if vin_number:
                logger.info(f"VIN found: {vin_number}")
                extracted_vins.append({"file": object_key, "vin": vin_number})

            else:
                logger.warning("VIN not found in extracted text.")

        return {"statusCode": 200, "body": json.dumps({"vin_data": extracted_vins})}

    except boto3.exceptions.Boto3Error as boto_err:
        logger.error("AWS SDK Issue: %s", str(boto_err))
        return {"statusCode": 500, "body": json.dumps({"error": "AWS service error"})}

    except ValueError as val_err:
        logger.error("Invalid Input: %s", str(val_err))
        return {"statusCode": 400, "body": json.dumps({"error": str(val_err)})}

    except Exception as e:
        logger.error("Unexpected Error: %s", str(e))
        return {"statusCode": 500, "body": json.dumps({"error": "Internal Server Error"})}
