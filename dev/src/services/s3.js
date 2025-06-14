import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { AWS_REGION } from "@/config/aws.js";

const s3 = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export default s3;