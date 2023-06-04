import {
  CaretRightOutlined,
  DeleteOutlined,
  PauseOutlined,
  ExportOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@ant-design/icons";
import { Card, Space, Button } from "antd";

import styles from "../styles/Segmentation.module.css";

type ButtonsCardProps = {
  handleStartButtonClick: any;
  inDrawing: any;
  drawingStarted: any;
  selectedPolygon: any;
  polygonInDrawing: any;
  handleFinishButtonClick: any;
  handleZoomIn: any;
  handleZoomOut: any;
  handleDeleteButtonClick: any;
  saveCoordenates: any;
};

const ButtonsCard = ({
  drawingStarted,
  handleDeleteButtonClick,
  handleFinishButtonClick,
  handleZoomIn,
  handleZoomOut,
  handleStartButtonClick,
  inDrawing,
  saveCoordenates,
  selectedPolygon,
  polygonInDrawing,
}: ButtonsCardProps) => {
  return (
    <div>
      <Card className={styles.card_tools} size="small">
        <Space direction="vertical" align="center" size={"middle"}>
          <Button
            type="primary"
            onClick={handleStartButtonClick}
            icon={<CaretRightOutlined />}
            disabled={inDrawing || drawingStarted}
          />
          <Button
            type="primary"
            onClick={handleFinishButtonClick}
            icon={<PauseOutlined />}
            disabled={
              !inDrawing ||
              (polygonInDrawing?.points.length != undefined &&
                polygonInDrawing?.points.length < 3)
            }
          />
          <Button
            type="primary"
            onClick={handleZoomIn}
            icon={<ZoomInOutlined />}
            disabled={inDrawing}
          />
          <Button
            type="primary"
            onClick={handleZoomOut}
            icon={<ZoomOutOutlined />}
            disabled={inDrawing}
          />
          <Button
            type="primary"
            danger
            onClick={handleDeleteButtonClick}
            icon={<DeleteOutlined />}
            disabled={inDrawing || selectedPolygon === null}
          />
          <Button
            type="primary"
            onClick={saveCoordenates}
            icon={<ExportOutlined />}
            disabled={inDrawing}
          />
        </Space>
      </Card>
    </div>
  );
};

export default ButtonsCard;
