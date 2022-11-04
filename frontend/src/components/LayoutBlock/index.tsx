import { Col, Row } from "antd";
import "./style.scss";

const LayoutBlock = ({
  title,
  headerElements,
  children,
}: {
  title?: string;
  headerElements?: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <div className="site-layout-block">
      <div className="block-header">
        <Row justify="space-between">
          <Col>{title && <h2 className="title">{title}</h2>}</Col>
          <Col>{headerElements}</Col>
        </Row>
      </div>
      {children}
    </div>
  );
};

export default LayoutBlock;
