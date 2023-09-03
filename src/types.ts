export type Class = {
  id: number,
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
  imageId: number;
  created_at: Date;
  resized: boolean;
};

export type Image = {
  id: number;
  file_name: string;
  url: any;
  width: number;
  height: number;
  formData: any;
};

export type Project = {
  name: string;
  description: string;
  images: Image[];
  classes: Class[];
};