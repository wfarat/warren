import { onRequest } from 'firebase-functions/v2/https';
import { v2 as cloudinary } from 'cloudinary';

export const generateCloudinarySignature = onRequest(
  {
    cors: ['http://localhost:5173', /https:\/\/warren-social\.web\.app$/],
    secrets: ['CLOUDINARY_URL'],
  },
  async (req, res) => {
    try {
      const { public_id } = req.body;
      const timestamp = Math.round(new Date().getTime() / 1000);

      const paramsToSign = {
        public_id,
        timestamp,
        upload_preset: 'warren-profiles',
        overwrite: true,
        invalidate: true,
      };

      const signature = cloudinary.utils.api_sign_request(
        paramsToSign,
        cloudinary.config().api_secret
      );

      res.status(200).json({
        signature,
        timestamp,
        api_key: cloudinary.config().api_key,
      });
    } catch (error) {
      console.error('Signature processing dropped:', error);
      res.status(500).send('Internal Server Error');
    }
  }
);
