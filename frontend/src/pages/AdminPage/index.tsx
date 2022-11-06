import { useContext } from "react";
import { Alert } from "antd";
import { useAppSelector } from "../../redux/hooks";

import { WebSocketContext } from "../../components/WebSocket";
import LayoutBlock from "../../components/LayoutBlock";
import TransactionFormBlock from "./transactionForm";
import AuthBlock from "./auth";
import EmployeesBlock from "./employees";
import TransactionsBlock from "./transactions";
import SettingsBlock from "./settings";
import { contactDeveloperStr } from "../../consts";
import "./style.scss";

const AdminPage = () => {
  const { error, user } = useAppSelector((state) => state);
  const socket = useContext(WebSocketContext);

  if (!socket)
    return (
      <LayoutBlock isWithoutBackground noHeader>
        <Alert
          message="Ошибка подключения"
          description={contactDeveloperStr}
          type="error"
        />
      </LayoutBlock>
    );

  if (!!Object.keys(error).length && socket && !socket.connected)
    return (
      <LayoutBlock isWithoutBackground noHeader>
        <Alert
          message={error.message}
          description={error.description}
          type="error"
        />
      </LayoutBlock>
    );

  return (
    <div className="page page-padding">
      {!user.isAuth ? (
        <AuthBlock />
      ) : (
        <>
          <LayoutBlock title="Создать поздравление">
            <TransactionFormBlock
              socket={socket}
              layout={{
                wrapperCol: { span: 22 },
                labelCol: { span: 2 },
                labelWrap: true,
              }}
            />
          </LayoutBlock>
          <SettingsBlock socket={socket} />
          <EmployeesBlock socket={socket} />
          <TransactionsBlock socket={socket} />
        </>
      )}
    </div>
  );
};

export default AdminPage;
