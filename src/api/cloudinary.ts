import { Cloudinary } from "@cloudinary/url-gen";

const cloudName = import.meta.env.VITE_CLOUDINARY;

export const cld = new Cloudinary({
  cloud: {
    cloudName,
  },
});

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();

  formData.append('file', file);
  formData.append('upload_preset', 'warren-media');

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  return data.public_id as string;
}

export async function uploadProfilePicture(source: File | string, userId: string): Promise<string> {
  const targetPublicId = `users/${userId}/profile`;
  const PRESET_NAME = 'warren-profiles';

  const tokenResponse = await fetch('https://generatecloudinarysignature-uraj7z4c3a-uc.a.run.app', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ public_id: targetPublicId }),
  });

  if (!tokenResponse.ok) throw new Error('Could not acquire authorized server signature.');
  const { signature, timestamp, api_key } = await tokenResponse.json();

  const formData = new FormData();
  formData.append('file', source);
  formData.append('public_id', targetPublicId);
  formData.append('upload_preset', PRESET_NAME);
  formData.append('api_key', api_key);
  formData.append('timestamp', timestamp.toString());
  formData.append('signature', signature);
  formData.append('overwrite', 'true');
  formData.append('invalidate', 'true');

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const response = await fetch(endpoint, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Signed transaction rejected.');
  }

  const data = await response.json();
  return data.public_id;
}
