import { Popconfirm } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

const ConfirmPopup = ({
  children,
  confirm,
  title,
}: {
  children: React.ReactNode;
  title?: string;
  confirm: () => void;
}) => {
  return (
    <Popconfirm
      title={title || "Вы уверены ?"}
      icon={<QuestionCircleOutlined style={{ color: "red" }} />}
      onConfirm={confirm}
    >
      {children}
    </Popconfirm>
  );
};

export default ConfirmPopup;
