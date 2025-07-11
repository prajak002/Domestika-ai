import { NextApiRequest, NextApiResponse } from 'next';

const HUGGINGFACE_TOKEN = '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';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { base64Image, prompt } = req.body;
  if (!base64Image) {
    return res.status(400).json({ error: 'No image found in request.' });
  }

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
          parameters: { prompt: prompt || 'Turn the cat into a tiger.' },
        }),
      }
    );
    const result = await response.json();
    return res.status(200).json(result);
  } catch (error: unknown) {
    return res.status(500).json({ error: (error && typeof error === 'object' && 'message' in error) ? (error as { message: string }).message : 'Unknown error' });
  }
} 