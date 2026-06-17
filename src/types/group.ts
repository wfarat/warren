export type Group = {
  id: string;
  name: string;
  description: string;
  tags: string[]; // Saved as a structured string array for queries
  bannerUrl?: string;
  bannerPublicId?: string;
  members: string[]; // Array of user UIDs, e.g., ["uid1", "uid2"]
  creatorId: string;
  createdAt: string;
};

export type CreateGroupValues = {
  name: string;
  description: string;
  tags: string;
  bannerUrl?: string;
  bannerPublicId?: string;
};

export type CreateGroupData = CreateGroupValues & { bannerFile?: File };
