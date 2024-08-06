import {
  S3Client,
  ListBucketsCommand,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";

const S3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});


export async function POST(request: Request, res) {

  const { file, fileName, fileType } = await request.json()
  console.log('name', fileName)
  console.log('type', fileType)


  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: fileName,
    ContentType: fileType,
  });

  try {
    const signedUrl = await getSignedUrl(S3, command, { expiresIn: 3600 });
    return NextResponse.json({ signedUrl });
  } catch (error) {
    console.error('Error generating signed URL:', error);
    res.status(500).json({ error: 'Error generating signed URL' });
  }
}

export async function GET(request: Request, res) {

  const input = {
    "Bucket": "talaash",
    "Key": "logo_hq.png"
  };
  const command = new GetObjectCommand(input);
  const response = await S3.send(command);
  console.log('response:', response)

  return NextResponse.json({ response })
}