import { PredictionServiceClient, helpers } from '@google-cloud/aiplatform';
import * as fs from 'fs';
import * as path from 'path';
import logger from './logger';

// --- CONFIGURATION ---
const PROJECT = 'gen-lang-client-0960678853';
const LOCATION = 'us-central1';
const MODEL_ID = 'imagen-4.0-generate-001';
const KEY_FILE = path.join(
  __dirname,
  '/../../../gen-lang-client-0960678853-93e2365ce457.json',
);

const predictionServiceClient = new PredictionServiceClient({
  apiEndpoint: `${LOCATION}-aiplatform.googleapis.com`,
  keyFilename: KEY_FILE,
});

const ENDPOINT = `projects/${PROJECT}/locations/${LOCATION}/publishers/google/models/${MODEL_ID}`;

interface GenerateOptions {
  prompt?: string;
  sampleCount?: number;
  aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
}

// ─────────────────────────────────────────────
// Main function
// ─────────────────────────────────────────────
export async function generateImageWithImagen(
  options: GenerateOptions,
): Promise<string> {
  const { prompt, sampleCount = 1, aspectRatio = '1:1' } = options;

  const instancePayload: Record<string, any> = {
    prompt: prompt,
  };

  const parametersPayload: Record<string, any> = {
    sampleCount,
    aspectRatio,
    safetySetting: 'block_some',
    personGeneration: 'allow_adult',
  };

  // ── Build and send request ──────────────────
  const request = {
    endpoint: ENDPOINT,
    instances: [helpers.toValue(instancePayload)],
    parameters: helpers.toValue(parametersPayload),
  };

  try {
    const [response] = await predictionServiceClient.predict(request);
    const rawPredictions = response.predictions ?? [];
    let image = '';

    if (rawPredictions.length === 0) {
      throw new Error(
        'No predictions returned. The prompt may have been filtered.',
      );
    }

    rawPredictions.forEach((pred: any) => {
      // FIX 5: helpers.fromValue returns a plain object; access the field directly.
      const converted = helpers.fromValue(pred as any) as any;
      const b64 =
        converted?.bytesBase64Encoded ?? converted?.image?.bytesBase64Encoded;

      if (!b64) {
        return;
      }

      // Support multiple images when sampleCount > 1
      const filename = `${crypto.randomUUID()}.jpeg`;
      const filePath = `public/images/${filename}`;

      ensureOutputDir(filePath);
      fs.writeFileSync(filePath, Buffer.from(b64, 'base64'));
      image = filename;
    });

    return image;
  } catch (error: any) {
    handleApiError(error);
    throw error; // Re-throw so callers can handle it
  }
}

function ensureOutputDir(filePath: string): void {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function handleApiError(error: any): void {
  const code = error.code ?? error.status;
  const messages: Record<number, string> = {
    3: 'INVALID_ARGUMENT — Check that all parameter names/values are correct.',
    7: 'PERMISSION_DENIED — Service account lacks "Vertex AI User" IAM role.',
    8: 'RESOURCE_EXHAUSTED — Quota exceeded. Wait or request a quota increase.',
    13:
      'INTERNAL — Usually a prompt/content refusal disguised as a server error.\n' +
      '   → Try a simpler prompt (e.g. "a red apple on a white table").\n' +
      '   → If using an image, ensure it has no policy-violating content.',
  };
  logger.error(
    `\n❌ API Error (Code ${code}): ${messages[code] ?? error.message}`,
  );
  if (error.details) logger.error('   Details:', error.details);
}
