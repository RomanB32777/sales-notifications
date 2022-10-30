import { Layout, Button } from "antd";
import { Link, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { logout } from "../../redux/types/User";
import { routers } from "../../App";
import "./style.scss";

const { Header } = Layout;

const HeaderBlock = () => {
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);

  const logoutClick = () => {
    dispatch(logout());
    localStorage.removeItem("isAuth");
  };

  if (pathname === routers.find((r) => r.path)?.path) return null;

  return (
    <Header className="header">
      <div className="header-nav">
        {routers.map((route) => (
          <Link key={route.path} to={route.path}>
            {route.name}
          </Link>
        ))}
      </div>
      {user.isAuth && <Button onClick={logoutClick}>Выйти</Button>}
    </Header>
  );
};

export default HeaderBlock;
