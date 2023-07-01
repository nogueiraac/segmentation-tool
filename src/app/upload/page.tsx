'use client';
import React, { useContext, useEffect, useState } from "react";
import { Card, Form, Input, Button, Modal, message } from "antd";
import type { NextPage } from "next";
import Head from "next/head";
import { UploadOutlined } from '@ant-design/icons';
import { useRouter } from "next/navigation";
import UploadedImagesContext from "../../context/uploadedImages";
import styles from "../styles/NewProject.module.css";
import ImageListITem from "../../components/ImageLisItem";
import InputFiles from "@/components/InputFiles";
import ClassesContext from "@/context/classes";
import ClassesItem from "@/components/ClassesItem";
import ProjectContext from "@/context/project";
import { randomColorGenerator } from "../utils/randomColorGenerator";
import { Class, Image } from "@/types";
import PolygonsContext from "@/context/polygons";
import { converterJSON } from "../utils/convertInputObject";

const Upload: NextPage = () => {
  const router = useRouter();
  const { TextArea } = Input;
  const [formNewProject] = Form.useForm();
  const [inputValue, setInputValue] = useState('');
  const [json, setJson] = useState<any>();
  const { uploadedImages, setUploadedImages } = useContext(UploadedImagesContext);
  const { classes, setClasses } = useContext(ClassesContext);
  const { project, setProject } = useContext(ProjectContext);
  const { setPolygons } = useContext(PolygonsContext);
  
  const onReset = () => {
    formNewProject.resetFields();
  };

  const onUpload = () => {
    const aux = formNewProject.getFieldsValue();
      setProject({
        classes: classes,
        description: aux.descriptionProject,
        name: aux.nameProject,
        images: uploadedImages,
      })
      router.push("/segmentation");
  };

  const onRemove = (item: Image) => {
    const newArray = uploadedImages.filter(
      (image: Image) => image.file_name !== item.file_name
    );
    setUploadedImages(newArray);
    message.success(`Image ${item.file_name} removed with successful`);
  };

  const handleInputEnter = (e: any) => {
    e.preventDefault();

    if (inputValue.trim() !== '') {
      setClasses([...classes, {name: inputValue, color: randomColorGenerator(), id: classes.length + 1 }]);

      formNewProject.resetFields(['classes'])
      setInputValue('');
    }
  };

  const onRemoveClass = (item: string) => {
    const newClasses = classes.filter(
      (classItem: Class) => classItem.name !== item
    );
    setClasses(newClasses);
    message.success(`Class '${item}' removed with successful`);
  }

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const contents = e?.target?.result;
      if (typeof contents === 'string') {
        try {
          const parsedData = JSON.parse(contents);
          setJson(parsedData);
        } catch (error) {
          console.error('Error parsing JSON file:', error);
        }
      }
    };

    reader.readAsText(file);
  };

  useEffect(() => {
    if (json) {
      const teste = converterJSON(json);
      let aux: any = null;
      if (typeof teste === 'string') {
        try {
          const parsedData = JSON.parse(teste);
          aux = parsedData;
        } catch (error) {
          console.error('Error parsing JSON file:', error);
        }
      }
      console.log(aux.polygons);
      setClasses(aux?.classes);
      setPolygons(aux?.polygons);
    }
  }, [json, setClasses, setPolygons])

  return (
    <>
      <Head>
        <title>Segmentation</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card className={styles.card_ant}>
        <Form form={formNewProject} layout="vertical">
          <Form.Item label="Name" name="nameProject" required>
            <Input placeholder="Name" value={project.name} required></Input>
          </Form.Item>
          <Form.Item label="Description" name="descriptionProject">
            <TextArea
              rows={4}
              placeholder="Define a brief description if necessary."
            />
          </Form.Item>
          <Form.Item label="Classes" name="classes">
            <Input 
              placeholder="Classes" 
              disabled={json}
              value={inputValue} 
              onChange={(e) => setInputValue(e.target.value)}
              onPressEnter={handleInputEnter}
            ></Input>
          </Form.Item>
            <Form.Item label="Upload Json">
              <input id="inputJson" type="file" onChange={handleFileChange} style={{ display: 'none'}} hidden />
              <Button onClick={() => document.getElementById('inputJson')?.click()} icon={<UploadOutlined />}> Upload Json </Button>
            </Form.Item>
          <ul style={{ listStyle: 'none', marginBottom: '16px', display: 'flex'}}>
            {classes.map((item: Class) => (
              <li key={item.name} style={{ marginBottom: '8px' }}>
                <ClassesItem content={item.name} onRemoveClass={onRemoveClass} />
              </li>
            ))}
          </ul>
          <InputFiles />
          <div style={{ display: 'flex', width: '100%' }}>
            <ul className={styles.imagesList}>
              {uploadedImages?.map((item) => (
                <li key={item.id}>
                  <ImageListITem item={item} onRemove={onRemove} />
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.buttons}>
            <Button
              key={2}
              type="primary"
              onClick={onUpload}
              disabled={!(uploadedImages?.length > 0 && classes.length > 0)}
            >
              Create Project
            </Button>
          </div>
        </Form>
      </Card>
      </div>
    </>
  );
};

export default Upload;
