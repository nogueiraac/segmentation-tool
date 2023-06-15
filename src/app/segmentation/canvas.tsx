import React from "react";

import { Card, Col } from "antd";

type CanvasProps = {
  canvas: any;
  handleCanvasClick: any;
};

const Canvas = ({ canvas, handleCanvasClick }: CanvasProps) => {
  return (
    <div>
      <Card>
        <Col span={14}>
          <div>
            <canvas
              ref={canvas}
              style={{ border: "1px solid black" }}
              onClick={handleCanvasClick}
            />
          </div>
        </Col>
      </Card>
    </div>
  );
};

export default Canvas;
