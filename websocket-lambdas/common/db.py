import boto3
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource("dynamodb")
TABLE_NAME = "WebSocketRoomConnections"
table = dynamodb.Table(TABLE_NAME)

def save_connection(room_key, connection_id):
    table.put_item(
        Item={
            "roomKey": room_key,
            "connectionId": connection_id,
        }
    )

def remove_connection(connection_id):
    response = table.scan(
        FilterExpression=Key("connectionId").eq(connection_id)
    )
    for item in response["Items"]:
        table.delete_item(
            Key={
                "roomKey": item["roomKey"],
                "connectionId": item["connectionId"],
            }
        )

def get_connections_for_room(room_key):
    response = table.query(
        KeyConditionExpression=Key("roomKey").eq(room_key)
    )
    return [item["connectionId"] for item in response["Items"]]
