import { AdvancedImage } from '@cloudinary/react';
import { cld } from '@/api';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { Button } from '@/components';
import Camera from '@/assets/icons/Camera.svg?react';
import { useAppSelector } from '@/store';
import { selectProfile } from '@/features';

export function ProfileHero() {
  const { name } = useAppSelector(selectProfile);
  return (
    <div>
      <AdvancedImage cldImg={cld.image('cld-sample-2').resize(fill().height(320).width(1240))} />
      <div className="-translate-y-1/2 pl-8 flex items-end">
        <div className="relative w-43 h-43">
          <AdvancedImage
            className="rounded-xl border-4 border-bg-2 drop-shadow-2xl shadow-xl "
            cldImg={cld.image('main-sample').resize(fill().height(192).width(192))}
          />
          <Button size="icon" className="absolute bottom-2 right-2">
            <Camera className="w-4 h-4" />
          </Button>
        </div>
        <h2>{name}</h2>
      </div>
    </div>
  );
}
