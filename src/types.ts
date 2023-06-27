export type Class = {
  id: number,
  name: string,
  color: string
}

export type Polygon = {
  points: [number, number][];
  color: string;
  name: string;
  class: Class;
  id: number;
  urlImage: string;
  imageName: string;
  imageId: number;
  created_at: Date;
};

export type Image = {
  id: number;
  file_name: string;
  url: string;
  width: number;
  height: number;
};

export type Project = {
  name: string;
  description: string;
  images: Image[];
  classes: Class[];
};