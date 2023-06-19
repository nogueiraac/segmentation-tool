import { useState } from "react";

import { DeleteOutlined } from "@ant-design/icons";
import { Badge, Button, Card, Col, Row, Select, Tag } from "antd";
import moment from "moment";

import styles from "../styles/Segmentation.module.css";
import { Class, Image, Polygon } from "@/types";

type CardsSectionProps = {
  setPolygonName: React.Dispatch<React.SetStateAction<string>>;
  classesOptions: Class[];
  selectedPolygon: Polygon | null;
  selectedImage: Image | null;
  polygons: Polygon[];
  setPolygons: React.Dispatch<React.SetStateAction<Polygon[]>>;
  classColor: (className: string) => string;
  setSelectedPolygon: React.Dispatch<React.SetStateAction<Polygon | null>>;
};

const CardsSection = ({
  classesOptions,
  polygons,
  setPolygons,
  selectedPolygon,
  selectedImage,
  setPolygonName,
  classColor,
  setSelectedPolygon,
}: CardsSectionProps) => {
  const [activeTabKey, setActiveTabKey] = useState<string>("classes");

  const onTabChange = (key: string) => {
    setActiveTabKey(key);
  };

  const onRemove = (item: Polygon) => {
    const newArray = polygons.filter(
      (polygon: Polygon) => polygon?.name !== item?.name
    );
    setSelectedPolygon(null);
    setPolygons(newArray);
  };

  const tabList = [
    {
      key: "classes",
      tab: "Classes",
    },
    {
      key: "annotations",
      tab: "Annotations",
    },
  ];

  const polygonGroups: { [key: string]: number } = {};
  polygons
    .filter((polygon: Polygon) => polygon.imageName === selectedImage?.name)
    .forEach((polygon: Polygon) => {
      const polygonClass = polygon.class;
      polygonGroups[polygonClass] = (polygonGroups[polygonClass] || 0) + 1;
    });

  const contentList: Record<string, React.ReactNode> = {
    classes:
      polygons.length > 0 ? (
        <Row gutter={[16, 12]}>
          {Object.keys(polygonGroups).map((polygonClass) => (
            <>
              <Col style={{ float: "left" }} span={18}>
                <Badge color={classColor(polygonClass)} text={polygonClass} />
              </Col>
              <Col style={{ float: "right" }} span={6}>
                <Tag color="blue">{polygonGroups[polygonClass]}</Tag>
              </Col>
            </>
          ))}
        </Row>
      ) : (
        <span>No segmented classes</span>
      ),
    annotations:
      polygons.length > 0 ? (
        <Row gutter={[16, 12]}>
          {polygons
            .filter((polygon: Polygon) => polygon.imageName === selectedImage?.name)
            .map((polygon: Polygon) => (
              <div
                key={polygon.id}
                onClick={() => setSelectedPolygon(polygon)}
                style={{ cursor: "pointer", display: "flex", width: "100%" }}
              >
                <Col style={{ float: "left" }} span={18}>
                  <Badge
                    color={classColor(polygon.class)}
                    text={polygon.class}
                  />
                </Col>
                <Col style={{ float: "right" }} span={6}>
                  <Button
                    onClick={() => onRemove(polygon)}
                    size="small"
                    color="red"
                    icon={<DeleteOutlined rev={undefined} />}
                    danger
                  />
                </Col>
              </div>
            ))}
        </Row>
      ) : (
        <span>No segmented classes</span>
      ),
  };

  const handlePolygonNameChange = (value: string) => {
    const newPolygonName = value;
    console.log(value)
    setPolygonName(newPolygonName);
  };

  return (
    <div>
      <Card
        className={styles.card_tab}
        tabList={tabList}
        activeTabKey={activeTabKey}
        size="small"
        onTabChange={(key) => {
          onTabChange(key);
        }}
      >
        {contentList[activeTabKey]}
      </Card>
      <Card
        title="Select the class to annotate"
        className={styles.card_tab}
        size="small"
      >
        <Select
          style={{ width: "100%" }}
          defaultValue={classesOptions[0]?.name}
          onChange={handlePolygonNameChange}
          options={classesOptions.map((option: { name: any }) => ({
            label: option?.name,
            value: option?.name,
          }))}
        />
      </Card>
      <Card title="Selected Polygon" className={styles.card_tab}>
        {selectedPolygon ? (
          <>
            <span>Name: {selectedPolygon.name}</span>
            <br />
            <span>Class: {selectedPolygon.class}</span>
            <br />
            <span>Image Name: {selectedPolygon.imageName}</span>
            <br />
            <br />
            <span>
              {moment(selectedPolygon.created_at).format("DD/MM/Y [at] HH:mm")}
            </span>
          </>
        ) : (
          "No selected polygon"
        )}
      </Card>
    </div>
  );
};

export default CardsSection;
