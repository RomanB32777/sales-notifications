import { Layout, Button } from "antd"
import { Link } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { logout } from "../../redux/types/User";
import "./style.scss";

const { Header } = Layout;

const HeaderBlock = () => {
    const dispatch = useAppDispatch()
    const user = useAppSelector(state => state.user)

    const logoutClick = () => {
        dispatch(logout())
        localStorage.removeItem('isAuth')
    }

    return (
        <Header className="header">
            <div className="header-nav">
                <Link to="/">Главная</Link>
                <Link to="admin">Админ</Link>
            </div>
            {user.isAuth && <Button onClick={logoutClick}>Выйти</Button>}
        </Header>
    )
}

export default HeaderBlock