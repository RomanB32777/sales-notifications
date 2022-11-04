import { createContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAppDispatch } from "../redux/hooks";
import { baseURL } from "../axiosClient";
import { login } from "../redux/types/User";
import { setLoading } from "../redux/types/Loading";
import { clearError, setError } from "../redux/types/Error";
import { setMessage } from "../redux/types/Message";
import { IMessage, ISettings } from "../types";
import { getTransactionsTop } from "../redux/types/Transactions";
import { getSettings } from "../redux/types/Settings";

const WebSocketContext = createContext<Socket | null>(null);

export { WebSocketContext };

export const WebSocketProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [valueContext, setValueContext] = useState<Socket | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const isAuth = localStorage.getItem("isAuth");
    isAuth && dispatch(login());

    const socket = io(baseURL, { path: "/sockt/" });

    dispatch(setLoading(true));

    socket.on("connect", () => {
      console.log("connect");
      dispatch(clearError());
      dispatch(setLoading(false));
    });

    socket.on("connect_error", () => {
      dispatch(
        setError({
          message: "Ошибка соединения",
          description:
            "Попробуйте перезагрузить сайт или обратитесь к разработчику",
        })
      );
      dispatch(setLoading(false));
    });

    socket.on("disconnect", () => {
      console.log("disconnect");
    });

    socket.on("add_mess", (data: IMessage) => {
      dispatch(setMessage({ ...data, active: true, isNewMessage: true }));
    });

    socket.on("update_transactions_top", (data: ISettings) => {
      dispatch(getTransactionsTop(data));
      dispatch(getSettings());
    });
    setValueContext(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={valueContext}>
      {children}
    </WebSocketContext.Provider>
  );
};
