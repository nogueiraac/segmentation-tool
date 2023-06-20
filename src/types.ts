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
  created_at: Date;
};

export type Image = {
  id: string;
  name: string;
  type: string;
  url: string;
  polygons: Polygon[];
};

export type Project = {
  name: string;
  description: string;
  images: Image[];
  classes: Class[];
};