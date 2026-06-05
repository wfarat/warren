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
};
