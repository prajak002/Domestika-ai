import formidable from 'formidable';
import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';

const HUGGINGFACE_TOKEN = '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';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: 'Error parsing file' });
    }
    const file = files.file;
    if (!file) {
      return res.status(400).json({ error: 'No image found in request.' });
    }
    const fileObj = Array.isArray(file) ? file[0] : file;
    const imageBuffer = fs.readFileSync(fileObj.filepath);
    const base64Image = imageBuffer.toString('base64');
    const prompt = fields.prompt || 'Turn the cat into a tiger.'; // Default prompt, can be customized

    try {
      const response = await fetch(
        'https://router.huggingface.co/fal-ai/fal-ai/flux-kontext/dev?_subdomain=queue',
        {
          headers: {
            Authorization: `Bearer ${HUGGINGFACE_TOKEN}`,
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({
            inputs: `data:image/png;base64,${base64Image}`,
            parameters: { prompt },
          }),
        }
      );
      const result = await response.json();
      return res.status(200).json(result);
    } catch (error: unknown) {
      return res.status(500).json({ error: (error && typeof error === 'object' && 'message' in error) ? (error as { message: string }).message : 'Unknown error' });
    }
  });
} 