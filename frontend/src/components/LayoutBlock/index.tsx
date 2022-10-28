import "./style.scss";

const LayoutBlock = ({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="site-layout-block">
      {title && <h2 className="title">{title}</h2>}
      {children}
    </div>
  );
};

export default LayoutBlock;
