import { randomColorGenerator } from "./randomColorGenerator";

type obj = {
  polygons: any[];
  classes: any[];
}

const getClass = (classes: any[], id: number) => {
  return classes.find((item: any) => (item.id === id))
}

const getImage = (images: any[], id: number) => {
  return images.find((item: any) => (item.id === id))
}

const setCoordenates = (points: number[][]) => {
  const arrayDeTuplas = points.flatMap((elemento) => {
    const tuplas = [];
    for (let i = 0; i < elemento.length - 1; i += 2) {
      tuplas.push([elemento[i], elemento[i + 1]]);
    }
    return tuplas;
  });

  return arrayDeTuplas;
}

export function converterJSON(jsonEntrada: any) {
  // Criar objeto de saída
  var jsonSaida: obj = {
    polygons: [],
    classes: []
  };

  // Mapear as categorias do JSON de entrada para classes no JSON de saída
  jsonEntrada.categories.forEach(function(category: any) {
    var classe = {
      name: category.name,
      color: randomColorGenerator(),
      id: category.id
    };
    jsonSaida.classes.push(classe);
  });

  // Criar um objeto para armazenar as classes
  var classesObj: any = {};

  // Preencher o objeto com as classes
  jsonSaida.classes.forEach(function(classe) {
    classesObj[classe.name] = classe;
  });

  // Mapear as anotações do JSON de entrada para polígonos no JSON de saída
  jsonEntrada.annotations.forEach((annotation: any) => {
    var poligono = {
      points: setCoordenates(annotation.segmentation),
      color: classesObj[getClass(jsonEntrada.categories, annotation.category_id).name].color,
      name: `${jsonSaida.polygons.length + 1} - ${getClass(jsonEntrada.categories, annotation.category_id).name}`,
      class: getClass(jsonEntrada.categories, annotation.category_id).name,
      id: jsonSaida.polygons.length + 1,
      imageId: annotation.image_id,
      imageName: getImage(jsonEntrada.images, annotation.image_id).file_name,
      created_at: new Date(),
      resized: false,
    };
    jsonSaida.polygons.push(poligono);
  });

  // Retornar o JSON de saída como string
  return JSON.stringify(jsonSaida);
}