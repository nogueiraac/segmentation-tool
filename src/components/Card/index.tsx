import { Card as CardAnt } from "antd";

import styles from "./styles.module.css";

type CardProps = {
  title?: string;
  style?: any;
};

type CardChildrenAndProps = CardProps & {
  children: any;
};

const Card = ({ title, style, children }: CardChildrenAndProps) => {
  return (
    <CardAnt
      title={title}
      className={styles.card}
      bordered={true}
      size="small"
      style={style}
    >
      {children}
    </CardAnt>
  );
};

export default Card;
