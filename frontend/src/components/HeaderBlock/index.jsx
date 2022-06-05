import { Button } from "antd"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { logoutUser } from "../../redux/actions/appActions"
import { Layout } from "antd";
import "./style.scss";

const { Header } = Layout;

const HeaderBlock = () => {
    const dispatch = useDispatch()
    const { user } = useSelector(state => state)

    const logout = () => {
        dispatch(logoutUser())
        localStorage.removeItem('isAuth')
    }

    return (
        <Header className="header">
            <div className="header-nav">
                <Link to="/">Главная</Link>
                <Link to="admin">Админ</Link>
            </div>
            {user.isAuth && <Button onClick={logout}>Выйти</Button>}
        </Header>
    )
}

export default HeaderBlock