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
import { Card, Space, Button, Tooltip } from "antd";

import styles from "../styles/Segmentation.module.css";

type ButtonsCardProps = {
  handleStartButtonClick: any;
  inDrawing: any;
  drawingStarted: any;
  selectedPolygon: any;
  selectedVertex: any;
  movingSelectedVertex: any;
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
  handleMovingSelectedVertexButtonClick: any;
  saveCoordenates: any;
};

const ButtonsCard = ({
  drawingStarted,
  handleDeletePolygonButtonClick,
  handlePointPolygonButtonClick,
  handleUndoPointClick,
  handleMovingSelectedVertexButtonClick,
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
  movingSelectedVertex,
  polygonInDrawing,
}: ButtonsCardProps) => {
  return (
    <div>
      <div style={{ display: "inline-block" }}>
        <Card title="Actions" className={styles.card_tools} size="small">
          <Space direction="vertical" align="center" size={"middle"}>
            <Tooltip placement="left" title="Start segmentation">
              <Button
                type="primary"
                danger
                onClick={handleUndoPointClick}
                icon={<UndoOutlined />}
                disabled={!inDrawing}
              />
            </Tooltip>
            <Tooltip placement="left" title="Delete point">
              <Button
                type="primary"
                danger
                onClick={handlePointPolygonButtonClick}
                icon={<DeleteOutlined />}
                disabled={
                  inDrawing ||
                  selectedVertex.length === 0 ||
                  movingSelectedVertex === true
                }
              />
            </Tooltip>
            <Tooltip placement="left" title="Edit selected point">
              <Button
                type="primary"
                onClick={handleMovingSelectedVertexButtonClick}
                icon={<EditOutlined />}
                disabled={
                  inDrawing ||
                  selectedVertex.length !== 1 ||
                  movingSelectedVertex === true
                }
              />
            </Tooltip>
            <Tooltip placement="left" title="Start segmentation">
              <Button
                type="primary"
                onClick={handleStartButtonClick}
                icon={<CaretRightOutlined />}
                disabled={inDrawing || drawingStarted || movingSelectedVertex === true}
              />
            </Tooltip>
            <Tooltip placement="left" title="Finish polygon">
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
            </Tooltip>
            <Tooltip placement="left" title="Zoom in">
              <Button
                type="primary"
                onClick={handleZoomIn}
                icon={<ZoomInOutlined />}
                disabled={inDrawing || movingSelectedVertex === true}
                // disabled={true}
              />
            </Tooltip>
            <Tooltip placement="left" title="Zoom out">
              <Button
                type="primary"
                onClick={handleZoomOut}
                icon={<ZoomOutOutlined />}
                disabled={inDrawing || movingSelectedVertex === true}
                // disabled={true}
              />
            </Tooltip>
            <Tooltip placement="left" title="Move up">
              <Button
                type="primary"
                onClick={handleDragUp}
                icon={<UpCircleOutlined />}
                disabled={inDrawing || movingSelectedVertex === true}
                // disabled={true}
              />
            </Tooltip>
            <Tooltip placement="left" title="Move down">
              <Button
                type="primary"
                onClick={handleDragDown}
                icon={<DownCircleOutlined />}
                disabled={inDrawing || movingSelectedVertex === true}
                // disabled={true}
              />
            </Tooltip>
            <Tooltip placement="left" title="Move left">
              <Button
                type="primary"
                onClick={handleDragLeft}
                icon={<LeftCircleOutlined />}
                disabled={inDrawing || movingSelectedVertex === true}
                // disabled={true}
              />
            </Tooltip>
            <Tooltip placement="left" title="Move right">
              <Button
                type="primary"
                onClick={handleDragRight}
                icon={<RightCircleOutlined />}
                disabled={inDrawing || movingSelectedVertex === true}
                // disabled={true}
              />
            </Tooltip>
            <Tooltip placement="left" title="Delete selected polygon">
              <Button
                type="primary"
                danger
                onClick={handleDeletePolygonButtonClick}
                icon={<DeleteOutlined />}
                disabled={inDrawing || selectedPolygon === null}
              />
            </Tooltip>
            <Tooltip placement="left" title="Export JSON">
              <Button
                type="primary"
                onClick={saveCoordenates}
                icon={<ExportOutlined />}
                disabled={inDrawing || movingSelectedVertex === true}
              />
            </Tooltip>
          </Space>
        </Card>
      </div>
    </div>
  );
};

export default ButtonsCard;
