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
import "./style.scss";

const AdminPage = () => {
  const { error, user } = useAppSelector((state) => state);
  const socket = useContext(WebSocketContext);

  if (!socket)
    return (
      <Alert
        message="Ошибка подключения"
        description="Попробуйте перезагрузить сайт или обратитесь к разработчику"
        type="error"
        style={{ margin: " 24px 0" }}
      />
    );

  if (!!Object.keys(error).length && socket && !socket.connected)
    return (
      <Alert
        message={error.message}
        description={error.description}
        type="error"
        style={{ margin: " 24px 0" }}
      />
    );

  return (
    <div className="page page-padding">
      {!user.isAuth ? (
        <AuthBlock />
      ) : (
        <>
          <LayoutBlock title="Создать поздравление">
            <TransactionFormBlock socket={socket} />
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
