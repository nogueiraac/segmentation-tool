export type Class = {
  name: string,
  color: string
}

export type Polygon = {
  points: [number, number][];
  color: string;
  name: string;
  class: string;
  id: number;
  urlImage: string;
  imageName: string;
  imageId: string;
  created_at: Date;
};

export type Image = {
  id: string;
  name: string;
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