'use client';
import React, { createContext, useState } from "react";

const useValue = () => {
  const [uploadedImages, setUploadedImages] = useState<any[]>([]);
  return {
    uploadedImages,
    setUploadedImages,
  };
};

interface Props {
  children: React.ReactNode;
}

const UploadedImagesContext = createContext({} as ReturnType<typeof useValue>);

function UploadedImagesProvider({ children }: Props) {
  return (
    <UploadedImagesContext.Provider value={useValue()}>
      {children}
    </UploadedImagesContext.Provider>
  );
}
export { UploadedImagesProvider };
export default UploadedImagesContext;
