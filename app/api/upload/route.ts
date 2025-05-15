import { NextRequest, NextResponse } from 'next/server';
import {
  S3Client,
  ListBucketsCommand,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';

const S3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files');

    const uploadPromises = files.map(async (file: any) => {
      if (!file || !(file instanceof File)) {
        throw new Error('Invalid file');
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const command = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: file.name,
        Body: buffer,
        ContentType: file.type,
      });

      await S3.send(command);

      const publicUrl = `https://pub-23946068d2f44c289928bf09891cda5a.r2.dev/${file.name}`;
      return { fileName: file.name, url: publicUrl };
    });

    const uploadedFiles = await Promise.all(uploadPromises);

    return NextResponse.json({
      success: true,
      message: 'Files uploaded successfully',
      files: uploadedFiles,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, message: 'Upload failed' },
      { status: 500 },
    );
  }
}
