import fs from 'fs';
import path from 'path';
import formidable from 'formidable';
import { IncomingForm } from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const uploadDir = path.join(process.cwd(), '/uploads');

  // Ensure /uploads folder exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }
  const form = formidable({
    uploadDir,
    keepExtensions: true,
    multiples: false,
  });

  form.parse(req, (err, fields, files) => {
    if (err || !files.file) {
      console.error(err);
      return res.status(500).json({ error: 'Upload failed' });
    }    const file = files.file[0];
    const uploadedPath = file.filepath;

    // Optional: Rename the file if needed
    const newFilePath = path.join(uploadDir, file.originalFilename || 'uploaded.csv');
    fs.renameSync(uploadedPath, newFilePath);

    return res.status(200).json({
      message: 'File uploaded and saved successfully.',
      fileName: path.basename(newFilePath),
    });
  });
}
