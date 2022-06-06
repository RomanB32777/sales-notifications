import {
  BrowserRouter as Router,
  useRoutes,
} from "react-router-dom";
import { Provider } from 'react-redux';

import { store } from './redux';
import { WebSocketProvider } from "./components/WebSocket";
import AdminPage from './pages/AdminPage';
import MainPage from './pages/MainPage';

import './assets/style/normalize.css';
import 'antd/dist/antd.min.css';
import './App.css';
import { Layout } from "antd";
import HeaderBlock from "./components/HeaderBlock";

const { Content } = Layout;

export const routers = [
  { path: '/', element: <MainPage /> },
  { path: '/admin', element: <AdminPage /> },
]

const Pages = () => {
  const el = useRoutes(routers)
  return el;
}

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <WebSocketProvider>
          <Layout style={{ height: '100vh' }}>
            <Router>
              <HeaderBlock />
              <Content style={{ height: '100%', padding: '0 50px' }}>
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
}

export default App;
