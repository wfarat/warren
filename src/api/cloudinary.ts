import { Cloudinary } from '@cloudinary/url-gen';

const cloudName = import.meta.env.VITE_CLOUDINARY;
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

export const cld = new Cloudinary({
  cloud: {
    cloudName,
  },
});
