import { Col, Row } from "antd";
import "./style.scss";

const LayoutBlock = ({
  children,
  title,
  noHeader,
  headerElements,
  isWithoutBackground,
}: {
  children: React.ReactNode;
  title?: string;
  noHeader?: boolean;
  headerElements?: React.ReactNode;
  isWithoutBackground?: boolean;
}) => {
  return (
    <div
      className={`site-layout-block ${
        isWithoutBackground ? "" : "withBackground"
      }`}
    >
      {!noHeader && (
        <div className="block-header">
          <Row justify="space-between">
            <Col>{title && <h2 className="title">{title}</h2>}</Col>
            <Col>{headerElements}</Col>
          </Row>
        </div>
      )}
      {children}
    </div>
  );
};

export default LayoutBlock;
