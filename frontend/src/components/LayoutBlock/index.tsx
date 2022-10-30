import { Col, Row } from "antd";
import "./style.scss";

const LayoutBlock = ({
  title,
  button,
  children,
}: {
  title?: string;
  button?: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <div className="site-layout-block">
      <div className="block-header">
        <Row justify="space-between">
          <Col>{title && <h2 className="title">{title}</h2>}</Col>
          <Col>{button}</Col>
        </Row>
      </div>
      {children}
    </div>
  );
};

export default LayoutBlock;
