import { NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import s3 from '@/services/s3';
import { Readable } from 'stream';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.csv')) {
      return NextResponse.json({ error: 'Only CSV files are allowed' }, { status: 400 });
    }

    // Create a unique key for the file
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const key = `input/${timestamp}-${sanitizedFileName}`;

    // Get file data as Buffer directly
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Set up S3 upload parameters with specific configuration to preserve data
    const uploadParams = {
      Bucket: process.env.S3_INPUT_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: 'text/csv',
      ContentDisposition: `attachment; filename="${file.name}"`,
      // Ensure no compression is applied
      ContentEncoding: 'identity',
      // Ensure data integrity
      ChecksumAlgorithm: 'SHA256',
    };

    const data = await s3.send(new PutObjectCommand(uploadParams));

    // Return success response with file details
    return NextResponse.json({
      success: true,
      key,
      fileName: file.name,
      size: buffer.length,
      url: `https://${process.env.S3_INPUT_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
      etag: data.ETag
    }, { status: 200 });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      error: 'Upload failed', 
      message: error.message 
    }, { status: 500 });
  }
}