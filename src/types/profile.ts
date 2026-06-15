export type Photo = {
  url?: string;
  publicId?: string;
};

export type Profile = {
  id: string;
  name: string;
  profession?: string;
  banner?: Photo;
  bio?: string;
  location?: string;
  website?: string;
  followers: number;
  following: number;
  updatedAt?: string;
  followedByMe?: boolean;
};

export type UpdateProfileInput = {
  name: string;
  location: string;
  bio: string;
  bannerUrl?: string;
  bannerFile?: File;
};
