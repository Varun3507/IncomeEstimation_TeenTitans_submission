import { NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import s3 from '@/services/s3';

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get('file');
  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const buffer = await file.arrayBuffer();
  const key = `input/${Date.now()}-${file.name}`;

  try {
    const data= await s3.send(new PutObjectCommand({
      Bucket: process.env.S3_INPUT_BUCKET,
      Key: key,
      Body: Buffer.from(buffer),
      ContentType: file.type,
    }));
    return NextResponse.json({ key, url: `https://${process.env.S3_INPUT_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}` }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}