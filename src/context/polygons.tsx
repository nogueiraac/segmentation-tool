'use client';
import { Polygon } from "@/types";
import React, { createContext, useState } from "react";

const useValue = () => {
  const [polygons, setPolygons] = useState<Polygon[]>([]);
  return {
    polygons,
    setPolygons,
  };
};

interface Props {
  children: React.ReactNode;
}

const PolygonsContext = createContext({} as ReturnType<typeof useValue>);

function PolygonsProvider({ children }: Props) {
  return (
    <PolygonsContext.Provider value={useValue()}>
      {children}
    </PolygonsContext.Provider>
  );
}
export { PolygonsProvider };
export default PolygonsContext;
