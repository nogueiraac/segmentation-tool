import { Polygon } from "@/types";

export function drawEdges(
  selectedPolygon: Polygon | null,
  polygonId: number,
  polygonPoints: [number, number][],
  polygonColor: string,
  ctx: CanvasRenderingContext2D
) {
  ctx.beginPath();

  ctx.moveTo(polygonPoints[0][0], polygonPoints[0][1]);
  for (let i = 1; i < polygonPoints.length; i++) {
    ctx.lineTo(polygonPoints[i][0], polygonPoints[i][1]);
  }
  ctx.closePath();

  ctx.lineWidth = 1;

  ctx.fillStyle =
    polygonId === selectedPolygon?.id
      ? `${polygonColor}99`
      : `${polygonColor}30`;
  ctx.fill();

  ctx.strokeStyle = polygonColor;
  ctx.stroke();
}

export function drawVertices(
  selectedVertex: { polygonId: number; vertexIndex: number } | null,
  polygonId: number | null,
  polygonPoints: [number, number][],
  polygonColor: string,
  ctx: CanvasRenderingContext2D
) {
  for (let i = 0; i < polygonPoints.length; i++) {
    ctx.beginPath();
    ctx.arc(polygonPoints[i][0], polygonPoints[i][1], 2.5, 0, 2 * Math.PI);
    ctx.closePath();

    ctx.lineWidth = 1;

    const vertexSelected =
      selectedVertex?.polygonId === polygonId &&
      selectedVertex?.vertexIndex === i;

    ctx.fillStyle = vertexSelected ? "#00ff00" : polygonColor;
    ctx.fill();

    // Sem isso, aumenta a precisão do clique.
    // ctx.strokeStyle = vertexSelected ? "#00ff00" : polygonColor;
    // ctx.stroke();
  }
}

export function drawPolygons(
  polygons: Polygon[],
  selectedImage: any,
  selectedPolygon: Polygon | null,
  selectedVertex: { polygonId: number; vertexIndex: number } | null,
  ctx: CanvasRenderingContext2D
) {
  polygons
    .filter((polygon: Polygon) => polygon.imageName === selectedImage.file_name)
    .forEach(({ points, color, id }) => {
      drawEdges(selectedPolygon, id, points, color, ctx);
      drawVertices(selectedVertex, id, points, color, ctx);
    });
}

export function drawPolygonInDrawing(
  polygonInDrawing: Polygon | null,
  drawingStarted: boolean,
  ctx: CanvasRenderingContext2D
) {
  if (polygonInDrawing && drawingStarted) {
    const { id, points, color } = polygonInDrawing;

    drawEdges(null, id, points, color, ctx);
    drawVertices(null, id, points, color, ctx);
  }
}

export const resizeImage = (
  image: { width: number; height: number },
  canvas: { width: number; height: number }
) => {
  const proportion = Math.min(
    canvas.width / image.width,
    canvas.height / image.height
  );

  let width = image.width * proportion;
  let height = image.height * proportion;
  let qtd = 1;
  // Aumenta o tamanho da imagem em 10% enquanto estiver dentro dos limites.
  while (width * 1.1 <= 900 && height * 1.1 <= 500) {
    width *= 1.1;
    height *= 1.1;
    qtd *= 1.1;
  }

  return { width, height, qtd };
};

export const calculateOriginalCoordinates = (
  resizedImageCoordinates: { x: number; y: number },
  image: { width: number; height: number },
  resizedImage: { width: number; height: number }
) => {
  const xRatio = image.width / resizedImage.width;
  const yRatio = image.height / resizedImage.height;

  const originalX = resizedImageCoordinates.x * xRatio;
  const originalY = resizedImageCoordinates.y * yRatio;

  return [Math.floor(originalX), Math.floor(originalY)];
};

export const calculateResizedCoordinates = (
  originalImageCoordinates: { x: number; y: number },
  image: { width: number; height: number },
  resizedImage: { width: number; height: number }
) => {
  const xRatio = resizedImage.width / image.width;
  const yRatio = resizedImage.height / image.height;

  const resizedX = originalImageCoordinates.x * xRatio;
  const resizedY = originalImageCoordinates.y * yRatio;

  return [Math.floor(resizedX), Math.floor(resizedY)];
};

export const isPointInsidePolygon = (
  x: number,
  y: number,
  points: [number, number][]
) => {
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const xi = points[i][0];
    const yi = points[i][1];
    const xj = points[j][0];
    const yj = points[j][1];

    const isIntersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

    if (isIntersect) {
      inside = !inside;
    }
  }
  return inside;
};

export const isPointInsideVertex = (
  x: number,
  y: number,
  points: [number, number][]
) => {
  for (let i = 0; i < points.length; i++) {
    const dx = points[i][0] - x;
    const dy = points[i][1] - y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= 2.5) {
      return i;
    }
  }
  return null;
};
