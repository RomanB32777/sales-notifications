import React, { useContext, useRef, useState } from 'react';
import { Form, Input, Button, InputNumber, Upload, Select, message, Alert, Skeleton } from 'antd';
import axios from 'axios';
import { WebSocketContext } from '../../components/WebSocket';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../redux/actions/appActions';
import { useNavigate } from 'react-router';
import "./style.scss";

const currencyTypes = [
    { value: "₽", label: "₽" },
    { value: "$", label: "$" },
    { value: "AED", label: "AED" },
    { value: "€", label: "€" }
];

const CurrencyTypeSelect = <Select options={currencyTypes} size="middle" placeholder="Валюта" />;

const AuthBlock = () => {
    const dispatch = useDispatch()
    const { user } = useSelector(state => state)

    const onFinish = (values) => {
        const { password } = values;
        if (password === user.password) {
            dispatch(loginUser())
            localStorage.setItem('isAuth', true)
        } else message.error("Не правильный пароль")
    };

    return (
        <Form
            name="auth"
            onFinish={onFinish}
            autoComplete="off"
        >
            <Form.Item
                label="Пароль"
                name="password"
                rules={[
                    {
                        required: true,
                        message: 'Пожалуйста, введите пароль!',
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
    );
};

const CreateBlock = () => {
    const { error, loading } = useSelector(state => state)
    const { socket } = useContext(WebSocketContext);
    const uploadInputRef = useRef(null);
    const [userImg, setUserImg] = useState(null);
    const navigate = useNavigate()

    const [form] = Form.useForm();

    const changeFile = ({ fileList }) => fileList && fileList[0] && setUserImg(fileList[0].originFileObj)

    const sendDataWithFile = async (cb) => {
        try {
            const formData = new FormData()
            formData.append('file', userImg)

            const { data } = await axios.post(`http://${window.location.hostname}:5000/upload/file`, formData, {
                headers: {
                    "Content-type": "multipart/form-data",
                }
            })
            cb && data.filename && cb(data.filename)
        } catch (error) {
            error.message && message.error(error.message)
        }
    }

    const onPreview = async file => {
        let src = file.url;
        if (!src) {
            src = await new Promise(resolve => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow.document.write(image.outerHTML);
    };

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    const onFinish = async (values) => {
        if (socket) {
            try {
                await sendDataWithFile(userImgName => {
                    socket.emit('new_message', { ...values, img: userImgName });
                    navigate('/')
                })
            } catch (error) {
                message.error('Произошла ошибка')
            }
        }
    };

    if (!!Object.keys(error).length && !socket.connected)
        return (
            <Alert
                message={error.message}
                description={error.description}
                type="error"
            />
        )

    if (!socket || loading) {
        return <Skeleton active />
    }

    return (
        <Form
            form={form}
            name="create-message"
            onFinish={onFinish}
        >
            <Form.Item
                name="employee"
                label="Сотрудник"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="project"
                label="Проект"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="value"
                label="Стоимость"
                rules={[
                    {
                        required: true,
                        type: 'number',
                        min: 0,
                    },
                ]}
            >
                <InputNumber style={{ width: '100%' }} addonAfter={
                    <Form.Item
                        name="currency"
                        noStyle
                    >
                        {CurrencyTypeSelect}
                    </Form.Item>
                } />
            </Form.Item>
            <Form.Item
                name="img"
                label="Фото"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                extra="Загрузить фото крутого сотрудника"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Upload
                    beforeUpload={() => false}
                    listType="picture-card"
                    maxCount={1}
                    ref={uploadInputRef}
                    onPreview={onPreview}
                    accept=".jpg, .jpeg, .png"
                    onChange={changeFile}
                >
                    Выбрать фото
                </Upload>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Создать
                </Button>
            </Form.Item>
        </Form>
    )
}

const AdminPage = () => {
    const { user } = useSelector(state => state)

    return (
        <div className="page">
            {!user.isAuth ?
                <AuthBlock />
                :
                <CreateBlock />
            }
        </div>
    )
}

export default AdminPage;





