export function returnBbox(points: number[]) {
  let menorX = Infinity;
  let maiorX = -Infinity;
  let menorY = Infinity;
  let maiorY = -Infinity;

  for (let i = 0; i < points.length; i++) {
    if (i % 2 === 0) { // Índice par
      if (points[i] < menorX) {
        menorX = points[i];
      }
      if (points[i] > maiorX) {
        maiorX = points[i];
      }
    } else { // Índice ímpar
      if (points[i] < menorY) {
        menorY = points[i];
      }
      if (points[i] > maiorY) {
        maiorY = points[i];
      }
    }
  }

  return [
    maiorY,
    maiorX,
    menorY,
    menorX,
  ];
}

