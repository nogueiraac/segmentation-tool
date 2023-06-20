import {
  CaretRightOutlined,
  DeleteOutlined,
  PauseOutlined,
  ExportOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  UpCircleOutlined,
  DownCircleOutlined,
  LeftCircleOutlined,
  RightCircleOutlined,
  UndoOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Card, Space, Button } from "antd";

import styles from "../styles/Segmentation.module.css";

type ButtonsCardProps = {
  handleStartButtonClick: any;
  inDrawing: any;
  drawingStarted: any;
  selectedPolygon: any;
  selectedVertex: any;
  movingVertex: any;
  polygonInDrawing: any;
  handleFinishButtonClick: any;
  handleZoomIn: any;
  handleZoomOut: any;
  handleDragUp: any;
  handleDragDown: any;
  handleDragRight: any;
  handleDragLeft: any;
  handleDeletePolygonButtonClick: any;
  handlePointPolygonButtonClick: any;
  handleUndoPointClick: any;
  handleMovingVertexButtonClick: any;
  saveCoordenates: any;
};

const ButtonsCard = ({
  drawingStarted,
  handleDeletePolygonButtonClick,
  handlePointPolygonButtonClick,
  handleUndoPointClick,
  handleMovingVertexButtonClick,
  handleFinishButtonClick,
  handleZoomIn,
  handleZoomOut,
  handleDragUp,
  handleDragDown,
  handleDragRight,
  handleDragLeft,
  handleStartButtonClick,
  inDrawing,
  saveCoordenates,
  selectedPolygon,
  selectedVertex,
  movingVertex,
  polygonInDrawing,
}: ButtonsCardProps) => {
  return (
    <div>
      <div style={{ display: "inline-block", marginRight: '16px' }}>
        <Card className={styles.card_tools} size="small">
          <Space direction="vertical" align="center" size={"middle"}>
            <Button
              type="primary"
              danger
              onClick={handleUndoPointClick}
              icon={<UndoOutlined />}
              disabled={!inDrawing}
            ></Button>
            <Button
              type="primary"
              danger
              onClick={handlePointPolygonButtonClick}
              icon={<DeleteOutlined />}
              disabled={
                inDrawing || selectedVertex === null || movingVertex === true
              }
            ></Button>
            <Button
              type="primary"
              onClick={handleMovingVertexButtonClick}
              icon={<EditOutlined />}
              disabled={
                inDrawing || selectedVertex === null || movingVertex === true
              }
            ></Button>
          </Space>
        </Card>
      </div>
      <div style={{ display: "inline-block" }}>
        <Card className={styles.card_tools} size="small">
          <Space direction="vertical" align="center" size={"middle"}>
            <Button
              type="primary"
              onClick={handleStartButtonClick}
              icon={<CaretRightOutlined />}
              disabled={inDrawing || drawingStarted || movingVertex === true}
            ></Button>
            <Button
              type="primary"
              onClick={handleFinishButtonClick}
              icon={<PauseOutlined />}
              disabled={
                !inDrawing ||
                (polygonInDrawing?.points.length != undefined &&
                  polygonInDrawing?.points.length < 3)
              }
            ></Button>
            <Button
              type="primary"
              onClick={handleZoomIn}
              icon={<ZoomInOutlined />}
              disabled={inDrawing || movingVertex === true}
              // disabled={true}
            ></Button>
            <Button
              type="primary"
              onClick={handleZoomOut}
              icon={<ZoomOutOutlined />}
              disabled={inDrawing || movingVertex === true}
              // disabled={true}
            ></Button>
            <Button
              type="primary"
              onClick={handleDragUp}
              icon={<UpCircleOutlined />}
              disabled={inDrawing || movingVertex === true}
              // disabled={true}
            ></Button>
            <Button
              type="primary"
              onClick={handleDragDown}
              icon={<DownCircleOutlined />}
              disabled={inDrawing || movingVertex === true}
              // disabled={true}
            ></Button>
            <Button
              type="primary"
              onClick={handleDragLeft}
              icon={<LeftCircleOutlined />}
              disabled={inDrawing || movingVertex === true}
              // disabled={true}
            ></Button>
            <Button
              type="primary"
              onClick={handleDragRight}
              icon={<RightCircleOutlined />}
              disabled={inDrawing || movingVertex === true}
              // disabled={true}
            ></Button>
            <Button
              type="primary"
              danger
              onClick={handleDeletePolygonButtonClick}
              icon={<DeleteOutlined />}
              disabled={inDrawing || selectedPolygon === null}
            ></Button>
            <Button
              type="primary"
              onClick={saveCoordenates}
              icon={<ExportOutlined />}
              disabled={inDrawing || movingVertex === true}
            ></Button>
          </Space>
        </Card>
      </div>
    </div>
  );
};

export default ButtonsCard;
