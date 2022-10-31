import { useEffect } from "react";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import { Provider } from "react-redux";
import { Layout } from "antd";

import { WebSocketProvider } from "./components/WebSocket";
import AdminPage from "./pages/AdminPage";
import MainPage from "./pages/MainPage";
import HeaderBlock from "./components/HeaderBlock";
import store from "./redux";
import { useAppDispatch } from "./redux/hooks";
import { getSettings } from "./redux/types/Settings";

import "./assets/style/normalize.css";
import "antd/dist/antd.min.css";
import "./App.css";

const { Content } = Layout;

export const routers = [
  { path: "/", name: "Главная", element: <MainPage /> },
  { path: "/admin", name: "Админ", element: <AdminPage /> },
];

const Pages = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getSettings());
  }, []);

  const el = useRoutes(routers);
  return el;
};

const App = () => {
  return (
    <div className="App">
      <Provider store={store}>
        <WebSocketProvider>
          <Layout>
            <Router>
              <HeaderBlock />
              <Content style={{ height: "100%" }}>
                <div className="site-layout-content">
                  <Pages />
                </div>
              </Content>
            </Router>
          </Layout>
        </WebSocketProvider>
      </Provider>
    </div>
  );
};

export default App;
