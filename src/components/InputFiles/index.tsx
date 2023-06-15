import React, { useContext, useState } from 'react';
import { InboxOutlined } from "@ant-design/icons";
import styles from "./styles.module.css";
import UploadedImagesContext from '@/context/uploadedImages';
import uuid from 'react-uuid';

const InputFiles = () => {
  const { uploadedImages, setUploadedImages } = useContext(UploadedImagesContext);
  const [isDragging, setIsDragging] = useState(false);

  const handleUploadFile = (event: any) => {
    const files: any[] = event.target.files;
    const aux = [];
    console.log(files.length);
    for (let index = 0; index < files.length; index += 1) {
      const fileObj = {
        id: uuid(),
        name: files[index].name,
        type: files[index].type,
        url: URL.createObjectURL(files[index]),
        polygons: [],
      };
      aux.push(fileObj)
      setUploadedImages(uploadedImages.concat(aux));
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    const aux = [];
    console.log(files.length);
    for (let index = 0; index < files.length; index += 1) {
      const fileObj = {
        id: uuid(),
        name: files[index].name,
        type: files[index].type,
        url: URL.createObjectURL(files[index]),
        polygons: [],
      };
      aux.push(fileObj)
      setUploadedImages(uploadedImages.concat(aux));
    }

    console.log(files);
  };

  return (
    <div className={styles.dragDropArea} 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => document.getElementById("input")?.click()}
    >
      <p className="ant-upload-drag-icon">
        <InboxOutlined rev={undefined} style={{ fontSize: '48px' }} />
      </p>
      <p className="ant-upload-text">
        Click or drag file to this area to upload. Max: 10.
      </p>
      <p className="ant-upload-hint">
        If you exceed the limit on the number of images. Only the first 10
        images will be accepted
      </p>
      <input id="input" type="file" onChange={handleUploadFile} multiple style={{ display: 'none'}} />
    </div>
  )
}

export default InputFiles;