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

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./uploads");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + file.originalname);
//   },
// });
// export const upload = multer({
//   storage: storage,
//   limits: { fileSize: 1024 * 1024 * 20 }, // TODO: change this to a smaller size file. Now is 20MB
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
//       cb(null, true);
//     } else {
//       cb(new Error("wrong image format"), false);
//     }
//   },
// });

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
  const command = new PutObjectCommand(params);
  await s3.send(command);
}
