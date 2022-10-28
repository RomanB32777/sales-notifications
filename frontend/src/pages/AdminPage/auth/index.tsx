import { Button, Form, Input, message } from "antd";
import LayoutBlock from "../../../components/LayoutBlock";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { login } from "../../../redux/types/User";

const AuthBlock = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);

  const onFinish = (values: { password: string }) => {
    const { password } = values;
    if (password === user.password) {
      dispatch(login());
      localStorage.setItem("isAuth", "true");
    } else message.error("Неправильный пароль");
  };

  return (
    <LayoutBlock title={"Авторизация"}>
      <Form name="auth" onFinish={onFinish} autoComplete="off">
        <Form.Item
          label="Пароль"
          name="password"
          rules={[
            {
              required: true,
              message: "Пожалуйста, введите пароль!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Войти
          </Button>
        </Form.Item>
      </Form>
    </LayoutBlock>
  );
};
export default AuthBlock;
