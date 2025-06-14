export const AWS_REGION = process.env.AWS_REGION;
export const S3_INPUT_BUCKET = process.env.S3_INPUT_BUCKET;
export const S3_OUTPUT_BUCKET = process.env.S3_OUTPUT_BUCKET;

if (!AWS_REGION || !S3_INPUT_BUCKET || !S3_OUTPUT_BUCKET) {
  throw new Error(
    'Missing AWS configuration. Please set AWS_REGION, S3_INPUT_BUCKET, and S3_OUTPUT_BUCKET in your environment.'
  );
}