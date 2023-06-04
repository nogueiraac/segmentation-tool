import React from "react";

import { DeleteOutlined } from "@ant-design/icons";
import { Button, Card, Image } from "antd";

import { Image as ImageType } from "../../types/types";
import styles from "./styles.module.css";

type ImageListItemProps = {
  item: ImageType;
  onRemove: (item: ImageType) => void;
};

export default function ImageListITem({ item, onRemove }: ImageListItemProps) {
  return (
    <Card size="small">
      <div className={styles.cardContent}>
        <div className={styles.cardLeftContent}>
          <Image
            className={styles.image}
            width={50}
            height={50}
            src={item.url}
          />
          {item.name}
        </div>
        <Button
          onClick={() => onRemove(item)}
          size="small"
          color="red"
          icon={<DeleteOutlined rev={undefined} />}
          danger
        />
      </div>
    </Card>
  );
}
