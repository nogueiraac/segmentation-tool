'use client';
import { Class } from "@/types";
import React, { createContext, useState } from "react";

const useValue = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  return {
    classes,
    setClasses,
  };
};

interface Props {
  children: React.ReactNode;
}

const ClassesContext = createContext({} as ReturnType<typeof useValue>);

function ClassesProvider({ children }: Props) {
  return (
    <ClassesContext.Provider value={useValue()}>
      {children}
    </ClassesContext.Provider>
  );
}
export { ClassesProvider };
export default ClassesContext;
