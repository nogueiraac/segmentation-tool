import React, { useState, useRef, useEffect } from "react";

interface Polygon {
  points: { x: number; y: number }[];
  color: string;
  name: string;
  id: number;
}

const Drawing: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  const [polygons, setPolygons] = useState<Polygon[]>([]);
  const [selectedPolygon, setSelectedPolygon] = useState<Polygon | null>(null);
  const [polygonName, setPolygonName] = useState<string>("Alita");

  const [drawingStarted, setDrawingStarted] = useState(false);
  const [inDrawing, setInDrawing] = useState(false);
  const [polygonInDrawing, setPolygonInDrawing] = useState<Polygon | null>(
    null
  );

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImage(img);
      if (canvasRef.current) {
        canvasRef.current.width = img.width;
        canvasRef.current.height = img.height;
      }
    };
    img.src =
      "http://publish.illinois.edu/concretemicroscopylibrary/files/2014/05/RM88A50.jpg";
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas

    if (!image) return;
    ctx.drawImage(image, 0, 0);

    // Desenha todos os polígonos existentes
    polygons.forEach(({ points, color, id }) => {
      ctx.beginPath(); // Começa um novo caminho de desenho
      ctx.moveTo(points[0].x, points[0].y); // Primeira coordenada, começa por ela
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y); // Desenha uma linha até a coordenada
      }
      ctx.closePath(); // Fecha o caminho de desenho

      ctx.lineWidth = 1;
      ctx.fillStyle = `${color}30`;

      // Se o polígono está selecionado
      if (id === selectedPolygon?.id) {
        ctx.lineWidth = 2;
        ctx.fillStyle = `${color}99`;
      }

      ctx.fill();

      ctx.strokeStyle = color;
      ctx.stroke();
    });

    // Desenha o polígono atual (se estiver desenhando)
    if (polygonInDrawing && drawingStarted) {
      const { points, color } = polygonInDrawing;
      ctx.beginPath(); // Começa um novo caminho de desenho
      ctx.moveTo(points[0].x, points[0].y); // Primeira coordenada, começa por ela
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y); // Desenha uma linha até a coordenada
      }

      if (inDrawing) {
        ctx.lineTo(points[0].x, points[0].y); // Conecta o último ponto com o primeiro
      }

      ctx.closePath(); // Fecha o caminho de desenho

      ctx.lineWidth = 1;
      ctx.fillStyle = `${color}30`;
      ctx.fill();

      ctx.strokeStyle = color;
      ctx.stroke();
    }

    // Adiciona o evento onMouseMove para mudar o cursor do mouse ao passar o mouse por cima de um polígono
    canvas.addEventListener("mousemove", (event) => {
      const { x, y } = getMousePosition(event);
      let cursorOverPolygon = false;
      polygons.forEach(({ points }) => {
        ctx.beginPath(); // Começa um novo caminho de desenho
        ctx.moveTo(points[0].x, points[0].y); // Primeira coordenada, começa por ela
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y); // Desenha uma linha até a coordenada
        }
        ctx.closePath(); // Fecha o caminho de desenho
        // Se o ponto está dentro do polígono
        if (ctx.isPointInPath(x, y)) {
          cursorOverPolygon = true;
        }
      });
      canvas.style.cursor = cursorOverPolygon ? "pointer" : "default";
    });
  }, [image, polygons, polygonInDrawing, inDrawing, selectedPolygon]);

  const getMousePosition = (event: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return { x, y };
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setSelectedPolygon(null);

    polygons.forEach((polygon) => {
      if (isPointInsidePolygon(x, y, polygon.points)) {
        setSelectedPolygon(polygon);
      }
    });

    if (!drawingStarted) return;

    if (!inDrawing) {
      // Começa um novo polígono
      setPolygonInDrawing({
        points: [{ x, y }],
        color: randomColor(),
        name: polygonName,
        id: polygons.length,
      });
      setInDrawing(true);
    } else {
      // Adiciona um ponto ao polígono atual
      setPolygonInDrawing((prevPolygon) => {
        if (!prevPolygon) return null;
        const newPoints = [...prevPolygon.points, { x, y }];
        return { ...prevPolygon, points: newPoints };
      });
    }
  };

  const isPointInsidePolygon = (
    x: number,
    y: number,
    points: { x: number; y: number }[]
  ) => {
    let inside = false;
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
      const xi = points[i].x;
      const yi = points[i].y;
      const xj = points[j].x;
      const yj = points[j].y;
      const intersect =
        yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  };

  const handleStartButtonClick = () => {
    setDrawingStarted(true);
  };

  const handlePolygonNameChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newPolygonName = event.target.value;
    setPolygonName(newPolygonName);
  };

  const handleFinishButtonClick = () => {
    if (!drawingStarted || !polygonInDrawing) return;

    setPolygons((prevPolygons) => [
      ...prevPolygons,
      {
        ...polygonInDrawing,
      },
    ]);

    setPolygonInDrawing(null);
    setInDrawing(false);
    setDrawingStarted(false);
  };

  const randomColor = () => "#ff0000";

  const handleDeleteButtonClick = () => {
    if (!selectedPolygon) return;
    setPolygons((prevPolygons) =>
      prevPolygons.filter((polygon) => polygon !== selectedPolygon)
    );
    setSelectedPolygon(null);
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        style={{ border: "1px solid black" }}
        onClick={handleCanvasClick}
      />
      <br />
      <select value={polygonName} onChange={handlePolygonNameChange}>
        <option value="Alita">Alita</option>
        <option value="Belita">Belita</option>
        <option value="C3S">C3S</option>
      </select>
      <button onClick={handleStartButtonClick}>Iniciar</button>
      <button onClick={handleFinishButtonClick}>Encerrar</button>
      <button onClick={handleDeleteButtonClick}>Excluir</button>
    </div>
  );
};

export default Drawing;