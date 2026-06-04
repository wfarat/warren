import { useState } from 'react';

type MediaType = 'image' | 'video';

export function useMediaDialog() {
  const [mediaType, setMediaType] = useState<MediaType | null>(null);

  const open = (type: MediaType) => setMediaType(type);
  const close = () => setMediaType(null);

  return {
    isOpen: mediaType !== null,
    mediaType,
    open,
    close,
  };
}
