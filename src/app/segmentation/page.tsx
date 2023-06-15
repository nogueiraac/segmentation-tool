'use client';
import React, { useState, useEffect, useRef, useContext } from "react";
import { Card } from "antd";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/navigation";

import styles from "../styles/Segmentation.module.css";
import UploadedImagesContext from "../../context/uploadedImages";
import { Polygon, Image as ImageType } from "@/types";
import ButtonsCard from "./buttonsCard";
import Canvas from "./canvas";
import CardsSection from "./cardsSection";
import ClassesContext from "@/context/classes";
import PolygonsContext from "@/context/polygons";

const Segmentation: NextPage = () => {
  const router = useRouter();
  const { uploadedImages } = useContext(UploadedImagesContext);
  const { classes } = useContext(ClassesContext);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  const [selectedImage, setSelectedImage] = useState<ImageType>();
  const {polygons, setPolygons } = useContext(PolygonsContext);
  const [selectedPolygon, setSelectedPolygon] = useState<Polygon | null>(null);
  const [polygonName, setPolygonName] = useState<string>(classes[0]?.name);
  const [drawingStarted, setDrawingStarted] = useState(false);
  const [inDrawing, setInDrawing] = useState(false);
  const [polygonInDrawing, setPolygonInDrawing] = useState<Polygon | null>(
    null
  );

  useEffect(() => {
    setSelectedImage(uploadedImages[0]);
  }, []);

  // useEffect(() => {
  //   setPolygons([
  //     ...polygons,
  //     {
  //       points: [
  //         [323.8499755859375, 181.4000015258789],
  //         [315.8499755859375, 232.4000015258789],
  //         [385.8499755859375, 236.4000015258789],
  //         [399.8499755859375, 171.4000015258789],
  //         [385.8499755859375, 159.4000015258789],
  //       ],
  //       color: "#ffff00",
  //       name: "Alita_1",
  //       class: "Alita",
  //       id: 0,
  //       idImage: uploadedImages[0].id,
  //       created_at: new Date("2023-05-16T23:33:39.705Z"),
  //     },
  //   ]);
  // }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas

    if (!image) return;
    ctx.drawImage(image, 0, 0);

    // Desenha todos os polígonos existentes
    polygons.forEach(({ points, color, id, imageName }) => {
      if (imageName === selectedImage?.name) {
        ctx.beginPath(); // Começa um novo caminho de desenho
        ctx.moveTo(points[0][0], points[0][1]); // Primeira coordenada, começa por ela
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i][0], points[i][1]); // Desenha uma linha até a coordenada
        }
        ctx.closePath(); // Fecha o caminho de desenho

        ctx.lineWidth = 1;
        ctx.fillStyle = `${color}30`;
        console.log('rodou')
        // Se o polígono está selecionado
        if (id === selectedPolygon?.id) {
          console.log('selecionado', color);
          ctx.lineWidth = 2;
          ctx.fillStyle = `${color}99`;
        }

        ctx.fill();

        ctx.strokeStyle = color;
        ctx.stroke();
      }
    });
  }, []);

  console.log(polygons);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImage(img);
      if (canvasRef.current) {
        canvasRef.current.width = img.width;
        canvasRef.current.height = img.height;
      }
    };
    if (selectedImage) {
      img.src = selectedImage?.url;
    }
  }, [selectedImage]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas

    if (!image) return;
    ctx.drawImage(image, 0, 0);

    // Desenha todos os polígonos existentes
    polygons.forEach(({ points, color, id, imageName }) => {
      if (imageName === selectedImage?.name) {
        ctx.beginPath(); // Começa um novo caminho de desenho
        ctx.moveTo(points[0][0], points[0][1]); // Primeira coordenada, começa por ela
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i][0], points[i][1]); // Desenha uma linha até a coordenada
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
      }
    });

    // Desenha o polígono atual (se estiver desenhando)
    if (polygonInDrawing && drawingStarted) {
      const { points, color } = polygonInDrawing;
      ctx.beginPath(); // Começa um novo caminho de desenho
      ctx.moveTo(points[0][0], points[0][1]); // Primeira coordenada, começa por ela
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i][0], points[i][1]); // Desenha uma linha até a coordenada
      }

      if (inDrawing) {
        ctx.lineTo(points[0][0], points[0][1]); // Conecta o último ponto com o primeiro
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
        ctx.moveTo(points[0][0], points[0][1]); // Primeira coordenada, começa por ela
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i][0], points[i][1]); // Desenha uma linha até a coordenada
        }
        ctx.closePath(); // Fecha o caminho de desenho
        // Se o ponto está dentro do polígono
        if (ctx.isPointInPath(x, y)) {
          cursorOverPolygon = true;
        }
      });
      canvas.style.cursor = cursorOverPolygon ? "pointer" : "default";
    });
  }, [image, polygons, polygonInDrawing, inDrawing, selectedPolygon, drawingStarted, selectedImage?.name]);

  const getMousePosition = (event: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return { x, y };
  };

  const saveCoordenates = () => {
    const data = {
      polygons: polygons,
      classes: classes,
    };
    const coordenadas = JSON.stringify(data);
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      coordenadas
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "data.json";

    link.click();
    console.log(coordenadas);
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setSelectedPolygon(null);

    polygons
      .filter((polygon: Polygon) => polygon.imageName === selectedImage?.name)
      .forEach((polygon) => {
        if (isPointInsidePolygon(x, y, polygon.points) && !drawingStarted) {
          setSelectedPolygon(polygon);
          // setClassShowed(polygon.name);
          // setTooltipPosition({x: event.clientX, y: event.clientY})
        }
      });

    if (!drawingStarted) return;

    if (!inDrawing) {
      // Começa um novo polígono
      setPolygonInDrawing({
        points: [[x, y]],
        color: classColor(polygonName),
        name: `${polygonName}_${polygons.length + 1}`,
        class: polygonName,
        id: polygons.length,
        imageName: selectedImage?.name,
        created_at: new Date(),
      });
      setInDrawing(true);
    } else {
      // Adiciona um ponto ao polígono atual
      const coordenadasAtualizadas = polygonInDrawing?.points;

      // Adiciona uma nova coordenada ao array
      coordenadasAtualizadas!.push([x, y]);
      if (coordenadasAtualizadas) {
        setPolygonInDrawing({...polygonInDrawing, points: coordenadasAtualizadas});
      }
      // Atualiza o estado com o novo array de coordenadas
      // setPolygonInDrawing((prevPolygon: Polygon) => {
      //   if (!prevPolygon) return null;
      //   const newPoints = [...prevPolygon.points, [x, y]];
      //   return { ...prevPolygon, points: newPoints };
      // });
    }
  };

  const classColor = (className: string) => {
    const classObj = classes.find((option) => option?.name === className);
    const classColor = classObj ? classObj.color : "#000000";
    return classColor;
  };

  const isPointInsidePolygon = (
    x: number,
    y: number,
    points: [x: number, y: number][]
  ) => {
    let inside = false;
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
      const xi = points[i][0];
      const yi = points[i][1];
      const xj = points[j][0];
      const yj = points[j][1];
      const intersect =
        yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  };

  const handleStartButtonClick = () => {
    setDrawingStarted(true);
    setSelectedPolygon(null);
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

  const handleDeleteButtonClick = () => {
    if (!selectedPolygon) return;
    setPolygons((prevPolygons) =>
      prevPolygons.filter((polygon) => polygon !== selectedPolygon)
    );
    setSelectedPolygon(null);
  };

  return (
    <>
      <Head>
        <title>Segmentation</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Card className={styles.card_ant}>
        <div className={styles.content_wrapper}>
          <div>
            <CardsSection
              setPolygonName={setPolygonName}
              classesOptions={classes}
              selectedPolygon={selectedPolygon}
              selectedImage={selectedImage}
              polygons={polygons}
              setPolygons={setPolygons}
              classColor={classColor}
              setSelectedPolygon={setSelectedPolygon}
            />
          </div>
          <Canvas canvas={canvasRef} handleCanvasClick={handleCanvasClick} />
          <div>
            <ButtonsCard
              handleStartButtonClick={handleStartButtonClick}
              inDrawing={inDrawing}
              drawingStarted={drawingStarted}
              selectedPolygon={selectedPolygon}
              polygonInDrawing={polygonInDrawing}
              handleFinishButtonClick={handleFinishButtonClick}
              handleDeleteButtonClick={handleDeleteButtonClick}
              saveCoordenates={saveCoordenates}
              handleZoomIn={undefined}
              handleZoomOut={undefined}
            />
          </div>
        </div>
        <div>
          <Card title="Images List" className={styles.imagesCard}>
            <ul className={styles.imagesList}>
              {uploadedImages.map((item: any) => (
                <li
                  className={styles.imagesListItem}
                  key={item.id}
                  style={{
                    border:
                      selectedImage?.id === item.id ? "3px solid yellow" : "",
                  }}
                  onClick={() => {
                    setSelectedImage(item);
                    setSelectedPolygon(null);
                  }}
                >
                  <img
                    className={styles.image}
                    src={item.url}
                    alt="Image uploaded"
                  />
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </Card>
    </>
  );
};

export default Segmentation;
