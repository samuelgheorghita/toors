import multer from "multer";
import dotenv from "dotenv";
import { S3Client } from "@aws-sdk/client-s3";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";

dotenv.config();

export const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

export const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: bucketRegion,
});

export const randomImgName = (bytes = 32) => crypto.randomBytes(bytes).toString("hex");

const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });

export async function uploadOnS3Bucket(img, imgName) {
  if (!imgName) {
    imgName = randomImgName();
  }

  const params = {
    Bucket: bucketName,
    Key: imgName,
    Body: img.buffer,
    ContentType: img.mimetype,
  };

  try {
    const command = new PutObjectCommand(params);
    await s3.send(command);
  } catch (error) {
    console.log(error);
  }
}
