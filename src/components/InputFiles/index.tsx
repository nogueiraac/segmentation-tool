import React, { useContext, useState } from 'react';
import { InboxOutlined } from "@ant-design/icons";
import styles from "./styles.module.css";
import UploadedImagesContext from '@/context/uploadedImages';
import uuid from 'react-uuid';
import { Image } from '@/types';

const InputFiles = () => {
  const { uploadedImages, setUploadedImages } = useContext(UploadedImagesContext);
  const [isDragging, setIsDragging] = useState(false);

  const handleUploadFile = (event: any) => {
    const files: any[] = event.target.files;
    const aux:Image[] = [];
      for (let index = 0; index < files.length; index += 1) {
        const fileObj = {
          id: index,
          file_name: files[index].name,
          url: URL.createObjectURL(files[index]),
          height: 0,
          width: 0,
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
    const aux: Image[] = [];
    for (let index = 0; index < files.length; index += 1) {
      const fileObj = {
        id: index,
        file_name: files[index].name,
        url: URL.createObjectURL(files[index]),
        height: 0,
        width: 0,
      };
      aux.push(fileObj)
      setUploadedImages(uploadedImages.concat(aux));
    }
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
        Click or drag file image to this area to upload.
      </p>
      <input id="input" type="file" onChange={handleUploadFile} multiple style={{ display: 'none'}} />
    </div>
  )
}

export default InputFiles;