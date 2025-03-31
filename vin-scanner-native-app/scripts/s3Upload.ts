import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const S3_BUCKET = "vin-ocr-lambda-bucket";
const REGION = process.env.EXPO_PUBLIC_AWS_REGION!;
console.log("KEY: ", process.env.EXPO_PUBLIC_AWS_ACCESS_KEY_ID!)
const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.EXPO_PUBLIC_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.EXPO_PUBLIC_AWS_SECRET_ACCESS_KEY!,
  },
});

export const uploadToS3 = async (
  fileUri: string,
  roomKey: string,
  repairInfo: string
): Promise<{ success: boolean}> => {
    try {
    const fileName = `images/${Date.now()}.jpg`;

    const params = {
      Bucket: S3_BUCKET,
      Key: fileName,
      ContentType: "image/jpeg",
      Metadata: {
        room_key: roomKey,
        repairInfo: repairInfo,
      },
    };

    const signedUrl = await getSignedUrl(s3, new PutObjectCommand(params), {
      expiresIn: 60,
    });

    const fileBlob = await fetch(fileUri).then((res) => res.blob());

    const response = await fetch(signedUrl, {
      method: "PUT",
      headers: { "Content-Type": "image/jpeg" },
      body: fileBlob,
    });

    if (!response.ok) throw new Error("Failed to upload");

    console.log(`✅ Image uploaded successfully: ${fileName}`);
    return {"success": true};
  } catch (error) {
    console.error("S3 Upload Error:", error);
    return {"success": false}
  }
};
