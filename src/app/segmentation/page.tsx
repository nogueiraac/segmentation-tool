"use client";
import React, { useState, useEffect, useRef, useContext } from "react";

import { Card } from "antd";
import type { NextPage } from "next";
import { useRouter } from "next/navigation";
import NextImage from "next/image";
import styles from "../styles/Segmentation.module.css";
import UploadedImagesContext from "../../context/uploadedImages";
import { Polygon, Image as ImageType, Class } from "@/types";
import ButtonsCard from "./buttonsCard";
import Canvas from "./canvas";
import CardsSection from "./cardsSection";

import {
  drawPolygons,
  drawPolygonInDrawing,
  resizeImage,
  isPointInsidePolygon,
  isPointInsideVertex,
  calculateOriginalCoordinates,
  calculateResizedCoordinates,
} from "../utils/segmentation";
import ProjectContext from "@/context/project";
import ClassesContext from "@/context/classes";
import PolygonsContext from "@/context/polygons";
import { returnBbox } from "../utils/returnBbox";

const Segmentation: NextPage = () => {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { uploadedImages, setUploadedImages } = useContext(
    UploadedImagesContext
  );
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [selectedImage, setSelectedImage] = useState<ImageType>({
    height: 0,
    id: 0,
    file_name: '',
    url: '',
    width: 0,
  });
  const { project, setProject } = useContext(ProjectContext);
  const { classes, setClasses } = useContext(ClassesContext);
  const { polygons, setPolygons } = useContext(PolygonsContext);
  const [selectedPolygon, setSelectedPolygon] = useState<Polygon | null>(null);
  const [polygonName, setPolygonName] = useState<string>(classes[0]?.name);
  const [selectedVertex, setSelectedVertex] = useState<{
    polygonId: number;
    vertexIndex: number;
  } | null>(null);

  const [movingVertex, setMovingVertex] = useState(false);
  
  const classColor = (className: string) => {
    const classObj = classes.find((option) => option?.name === className);
    const classColor = classObj ? classObj.color : "#000000";
    return classColor;
  };

  const classInfo = (key: 'name', value: string | number) => {
    const aux = classes.find((item: Class) => item[key] === value);
    return aux || classes[0];
  }

  const [drawingStarted, setDrawingStarted] = useState(false);
  const [inDrawing, setInDrawing] = useState(false); // PERGUNTAR SE PRECISA DO IN DRAWING
  const [polygonInDrawing, setPolygonInDrawing] = useState<Polygon | null>(
    null
  );

  const [scale, setScale] = useState(1.0);
  const [dragPosition, setDragPosition] = useState([0.0, 0.0]);

  const initialCanvas = { width: 800, height: 400 };

  useEffect(() => {
    if (classes.length < 1 || uploadedImages.length < 1) {
      router.push('/');
    }
  })


  useEffect(() => {
    if (uploadedImages.length > 0) {
      setSelectedImage(uploadedImages[0]);
    }
  }, []);

  useEffect(() => {
    let aux: number[][] = [];
    let auxPolygon: Polygon;
    console.log('teste');
    if (selectedImage && image) {
      polygons.forEach((polygon) => {
        if (polygon.resized === false) {
          aux = polygon.points.map((item) => {
            return calculateResizedCoordinates({x: item[0], y: item[1]}, {width: image!.width, height: image!.height}, { width: canvasRef!.current!.width, height: canvasRef!.current!.height})
          })
          auxPolygon = {... polygon, points: aux as unknown as [number, number][], resized: true}
          setPolygons([auxPolygon]);

          /* terminar de implementar logica*/
        }
      })
    }
  }, [selectedImage, image]);

  useEffect(() => {
    if (!selectedImage) return;
    const img = new Image();

    img.onload = () => {
      if (!canvasRef.current) return;

      setImage(img);
      const { width, height, qtd } = resizeImage(img, initialCanvas);
      canvasRef.current.width = width;
      canvasRef.current.height = height;
    };

    img.src = selectedImage.url;
  }, [selectedImage]);

  useEffect(() => {
    if(image) {
      let teste = uploadedImages.map((item: ImageType) => {
        if(item.file_name === selectedImage.file_name) {
          item.height = image.height
          item.width = image.width;

          return item;
        }
        return item;
      })

      setUploadedImages(teste);
    }
  }, [image]);

  useEffect(() => {
    if (!image) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.scale(scale, scale);
    ctx.translate(dragPosition[0], dragPosition[1]);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    drawPolygons(polygons, selectedImage, selectedPolygon, selectedVertex, ctx);

    ctx.restore();

    drawPolygonInDrawing(polygonInDrawing, drawingStarted, ctx);

    canvasMouseMoveEvent(canvas, polygons, selectedImage, scale);
  }, [
    image,
    polygons,
    polygonInDrawing,
    inDrawing,
    selectedPolygon,
    selectedVertex,
    drawingStarted,
    scale,
    dragPosition,
  ]);

  function canvasMouseMoveEvent(
    canvas: HTMLCanvasElement,
    polygons: Polygon[],
    selectedImage: any,
    scale: number
  ) {
    canvas.addEventListener("mousemove", (event) => {
      const { x, y } = getMousePosition(event);
      let cursorOverPolygon = false;
      polygons
        .filter((polygon: Polygon) => polygon.imageName === selectedImage.file_name)
        .forEach(({ points }) => {
          const a = isPointInsideVertex(
            x / scale - dragPosition[0],
            y / scale - dragPosition[1],
            points
          );

          const b = isPointInsidePolygon(
            x / scale - dragPosition[0],
            y / scale - dragPosition[1],
            points
          );

          if (a !== null || b) {
            cursorOverPolygon = true;
          }
        });

      canvas.style.cursor = cursorOverPolygon ? "pointer" : "default";
    });
  }

  const getMousePosition = (event: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return { x, y };
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    // < AQUI NÃO DÁ PRA UTILIZAR O getMousePosition, ENTÃO FAÇO MANUALMENTE. >
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    // < AQUI NÃO DÁ PRA UTILIZAR O getMousePosition, ENTÃO FAÇO MANUALMENTE. />

    if (movingVertex && selectedVertex) {
      setPolygons((prevPolygons) => {
        const { polygonId, vertexIndex } = selectedVertex;
        const updatedPolygons = [...prevPolygons];
        const updatedPoints = [...updatedPolygons[polygonId].points];
        updatedPoints[vertexIndex] = [x, y];
        updatedPolygons[polygonId] = {
          ...updatedPolygons[polygonId],
          points: updatedPoints,
        };
        return updatedPolygons;
      });
      setMovingVertex(false);
    }

    setSelectedVertex(null);
    setSelectedPolygon(null);

    if (!drawingStarted) {
      let polygonIsSelected = false;
      let vertexIsSelected = false;

      polygons
        .filter((polygon: Polygon) => polygon.imageName === selectedImage?.file_name)
        .forEach((polygon) => {
          const a = isPointInsideVertex(
            x / scale - dragPosition[0],
            y / scale - dragPosition[1],
            polygon.points
          );

          const b = isPointInsidePolygon(
            x / scale - dragPosition[0],
            y / scale - dragPosition[1],
            polygon.points
          );

          // PRIMEIRO VERIFICA SE O VÉRTICE ESTÁ SELECIONADO, POIS ELE É PRIORIDADE EM CASO DE UMA ARESTA E UM VÉRTICE DIVIDIREM UM MESMO PONTO.
          if (a !== null && polygonIsSelected === false) {
            setSelectedVertex({
              polygonId: polygon.id,
              vertexIndex: a,
            });
            vertexIsSelected = true;
          } else if (b && vertexIsSelected === false) {
            // CASO CONTRÁRIO, VERIFICA SE O POLÍGONO ESTÁ SELECIONADO.
            setSelectedPolygon(polygon);
            polygonIsSelected = true;
          }
        });
    }

    if (!drawingStarted) return;

    if (!inDrawing) {
      // Começa um novo polígono
      setPolygonInDrawing({
        points: [[x, y]],
        color: classColor(polygonName),
        name: `${polygons.length + 1}-${polygonName}`,
        class: polygonName,
        id: polygons.length + 1,
        urlImage: selectedImage?.url || "",
        imageName: selectedImage?.file_name || "",
        imageId: selectedImage.id,
        created_at: new Date(),
        resized: true,
      });
      setInDrawing(true);
    } else {
      const coordenadasAtualizadas = polygonInDrawing?.points;

      // Adiciona uma nova coordenada ao array
      coordenadasAtualizadas!.push([x, y]);
      if (coordenadasAtualizadas) {
        setPolygonInDrawing({
          ...polygonInDrawing,
          points: coordenadasAtualizadas,
        });
      }
      // Adiciona um ponto ao polígono atual
      // setPolygonInDrawing((prevPolygon) => {
      //   if (!prevPolygon) return null;
      //   const newPoints = [...prevPolygon.points, [x, y]];
      //   return { ...prevPolygon, points: newPoints };
      // });
    }
  };

  const saveCoordenates = () => {
    let newPolygons: any[] = [];
    polygons.forEach(({ imageId, imageName, points, class: actualClass }, index: number) => {
      const segmentation = [points.map((item: [number, number]) => {
        return calculateOriginalCoordinates({x: item[0], y: item[1]}, {width: image!.width, height: image!.height}, { width: canvasRef!.current!.width, height: canvasRef!.current!.height})
      }).flatMap((coordItem) => coordItem)];
      const polygon = {
        id_mask: index + 1,
        image_id: imageId,
        category_id: classInfo('name', actualClass).id,
        segmentation,
        bbox: returnBbox(segmentation[0]),
      }
      newPolygons = [...newPolygons, polygon];
    });
    const data = {
      projectName: project.name,
      projectDescription: project.description,
      annotations: newPolygons,
      images: uploadedImages,
      categories: classes.map((item: Class) => { return { id: item.id, name: item.name }}),
    };
    const coordenadas = JSON.stringify(data);
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      coordenadas
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "data.json";

    link.click();
  };

  const handleStartButtonClick = () => {
    setDrawingStarted(true);
    setSelectedPolygon(null);
    setSelectedVertex(null);
  };

  const handleFinishButtonClick = () => {
    if (!drawingStarted || !polygonInDrawing) return;

    // Operações reversas considerando a escala atual e translação atual.
    for (let i = 0; i < polygonInDrawing.points.length; i++) {
      polygonInDrawing.points[i][0] =
        polygonInDrawing.points[i][0] / scale - dragPosition[0];
      polygonInDrawing.points[i][1] =
        polygonInDrawing.points[i][1] / scale - dragPosition[1];
    }

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
  // corrigir nome pq agora tera o do polygono e do verticr
  const handleDeletePolygonButtonClick = () => {
    if (!selectedPolygon) return;
    setPolygons((prevPolygons) =>
      prevPolygons.filter((polygon) => polygon !== selectedPolygon)
    );
    setSelectedPolygon(null);
  };

  const handlePointPolygonButtonClick = () => {
    if (!selectedVertex) return;

    polygons
      .filter((polygon: Polygon) => polygon.imageName === selectedImage?.file_name)
      .filter((polygon: Polygon) => polygon.id === selectedVertex.polygonId)
      .forEach(({ points }) => {
        setPolygons;
        if (points.length <= 3) {
          setPolygons((prevPolygons) =>
            prevPolygons.filter(
              (polygon) => polygon.id !== selectedVertex.polygonId
            )
          );
        } else {
          const beforeSelectedVertex = points.slice(
            0,
            selectedVertex.vertexIndex
          );
          const afterSelectedVertex = points.slice(
            selectedVertex.vertexIndex + 1
          );
          const newPoints = beforeSelectedVertex.concat(afterSelectedVertex);

          setPolygons((prevPolygons) =>
            prevPolygons.map((polygon) => {
              if (polygon.id === selectedVertex.polygonId) {
                return { ...polygon, points: newPoints };
              }
              return polygon;
            })
          );
        }

        setSelectedVertex(null);
      });
  };

  const handleMovingVertexButtonClick = () => {
    setMovingVertex(true);
  };

  const handleUndoPointClick = () => {
    if (!polygonInDrawing) return;

    if (polygonInDrawing.points.length === 1) {
      setPolygonInDrawing(null);
      setInDrawing(false);
      setDrawingStarted(false);
    } else {
      setPolygonInDrawing((prevPolygon) => {
        if (!prevPolygon) return null;
        const newPoints = prevPolygon.points.slice(0, -1);
        return { ...prevPolygon, points: newPoints };
      });
    }
  };

  const handleZoomIn = () => {
    if (scale + 0.1 <= 2.0) {
      setScale((prevScale) => prevScale + 0.1);
    }
  };

  const handleZoomOut = () => {
    if (scale - 0.1 >= 1.0) {
      setScale((prevScale) => prevScale - 0.1);
    }

    if (!image) return;

    let newScale = scale - 0.1;
    let newDragPosition = [dragPosition[0], dragPosition[1]];
    const { width, height } = resizeImage(image, initialCanvas);

    if (newScale >= 1.0) {
      while ((width + newDragPosition[0]) * newScale < width) {
        newDragPosition[0] += 1.0;
      }
    }
    setDragPosition((prevDragPosition) => ({
      ...prevDragPosition,
      [0]: prevDragPosition[0] + newDragPosition[0] - dragPosition[0],
    }));

    if (newScale >= 1.0) {
      while ((height + newDragPosition[1]) * newScale < height) {
        newDragPosition[1] += 1.0;
      }
    }
    setDragPosition((prevDragPosition) => ({
      ...prevDragPosition,
      [1]: prevDragPosition[1] + newDragPosition[1] - dragPosition[1],
    }));
  };

  const handleDragUp = () => {
    if (!image) return;

    const maxIterations = 13;
    let interations = 0;
    let newDragPositionY = dragPosition[1];
    const { height } = resizeImage(image, initialCanvas);

    while (
      interations < maxIterations &&
      height + newDragPositionY + 1.0 <= height
    ) {
      newDragPositionY += 1.0;
      interations++;
    }

    setDragPosition((prevDragPosition) => ({
      ...prevDragPosition,
      [1]: prevDragPosition[1] + newDragPositionY - dragPosition[1],
    }));
  };

  const handleDragDown = () => {
    if (!image) return;

    const maxIterations = 13;
    let interations = 0;
    let newDragPositionY = dragPosition[1];
    const { height } = resizeImage(image, initialCanvas);

    while (
      interations < maxIterations &&
      (height + newDragPositionY - 1.0) * scale >= height
    ) {
      newDragPositionY -= 1.0;
      interations++;
    }

    setDragPosition((prevDragPosition) => ({
      ...prevDragPosition,
      [1]: prevDragPosition[1] + newDragPositionY - dragPosition[1],
    }));
  };

  const handleDragLeft = () => {
    if (!image) return;

    const maxIterations = 13;
    let interations = 0;
    let newDragPositionX = dragPosition[0];
    const { width } = resizeImage(image, initialCanvas);

    while (
      interations < maxIterations &&
      width + newDragPositionX + 1.0 <= width
    ) {
      newDragPositionX += 1.0;
      interations++;
    }

    setDragPosition((prevDragPosition) => ({
      ...prevDragPosition,
      [0]: prevDragPosition[0] + newDragPositionX - dragPosition[0],
    }));
  };

  const handleDragRight = () => {
    if (!image) return;

    const maxIterations = 13;
    let interations = 0;
    let newDragPositionX = dragPosition[0];
    const { width } = resizeImage(image, initialCanvas);

    while (
      interations < maxIterations &&
      (width + newDragPositionX - 1.0) * scale >= width
    ) {
      newDragPositionX -= 1.0;
      interations++;
    }

    setDragPosition((prevDragPosition) => ({
      ...prevDragPosition,
      [0]: prevDragPosition[0] + newDragPositionX - dragPosition[0],
    }));
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card className={styles.card_ant}>
        <div className={styles.content_wrapper}>
          <div>
            <CardsSection
              setPolygons={setPolygons}
              setPolygonName={setPolygonName}
              classesOptions={classes}
              selectedPolygon={selectedPolygon}
              selectedImage={selectedImage}
              polygons={polygons}
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
              selectedVertex={selectedVertex}
              movingVertex={movingVertex}
              polygonInDrawing={polygonInDrawing}
              handleFinishButtonClick={handleFinishButtonClick}
              handleZoomIn={handleZoomIn}
              handleZoomOut={handleZoomOut}
              handleDragUp={handleDragUp}
              handleDragDown={handleDragDown}
              handleDragRight={handleDragRight}
              handleDragLeft={handleDragLeft}
              handleDeletePolygonButtonClick={handleDeletePolygonButtonClick}
              handleUndoPointClick={handleUndoPointClick}
              handlePointPolygonButtonClick={handlePointPolygonButtonClick}
              handleMovingVertexButtonClick={handleMovingVertexButtonClick}
              saveCoordenates={saveCoordenates}
            />
          </div>
        </div>
        <div>
          <Card
            title={`Images List • ${selectedImage?.file_name}`}
            className={styles.imagesCard}
          >
            <ul className={styles.imagesList}>
              {uploadedImages.map((item: any) => (
                <li
                  className={styles.imagesListItem}
                  key={item.id}
                  style={{
                    border:
                      selectedImage?.id === item.id ? "3px solid #1677ff" : "",
                  }}
                  onClick={() => {
                    setSelectedImage(item);
                    setSelectedPolygon(null);
                    setSelectedVertex(null);
                    setScale(1.0);
                    setDragPosition([0.0, 0.0]);
                  }}
                >
                  <NextImage
                    className={styles.image}
                    src={item.url}
                    alt="Image uploaded"
                    height={0}
                    width={0}
                  />
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </Card>
    </div>
  );
};

export default Segmentation;
