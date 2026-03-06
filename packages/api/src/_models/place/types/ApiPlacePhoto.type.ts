export type ApiPlacePhoto = {
  _id?: string;
  encoding: string;
  mimetype: string;
  filename: string;
  path: string;
  size: number;
  lieu_id: number;
  parcours_id: number | null;
  createdAt?: Date;
  updatedAt?: Date;
};
