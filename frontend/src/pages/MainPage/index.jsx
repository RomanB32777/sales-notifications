import React, { useCallback, useEffect } from 'react';
import { Drawer, Button, Row, Col } from 'antd';
import testImg from '../../assets/images/Dubai.jpg'
import { useDispatch, useSelector } from 'react-redux';
import useSound from 'use-sound';
import { hideDrawer, showDrawer } from '../../redux/actions/appActions';
import sound from '../../assets/sounds/fanfary.mp3'
import "./style.scss";

const formatNumber = (value, currency) => {
    return Intl.NumberFormat('Ru-ru', {
        style: 'currency',
        currency: currency,
        maximumFractionDigits: 0,
    }).format(Number(value))
}

const MainPage = () => {
    const { message } = useSelector(state => state)
    const dispatch = useDispatch()
    const [play, { stop }] = useSound(sound);

    const showDrawerClick = () => {
        dispatch(showDrawer())
    };

    const onClose = () => {
        dispatch(hideDrawer())
        stop()
    };

    const playMusic = useCallback(() => {
        if (message.active && message.isNewMessage)
            play()
    }, [message, play])

    useEffect(() => playMusic(), [playMusic])

    return (
        <div className="page">
            <Button type="primary" onClick={showDrawerClick} >
                Показать блок
            </Button>

            <Drawer
                placement="right"
                width="100%"
                onClose={onClose}
                visible={message.active}
            >
                <Row className="message-block">
                    <Col span={10}>
                        <div className="message-block_img">
                            <img
                                src={message.img
                                    ? `http://${window.location.hostname}:${process.env.REACT_APP_BACKEND_PORT || 5000}/images/${message.img}`
                                    : testImg
                                } alt="test" />
                        </div>
                    </Col>
                    <Col span={14} >
                        <div className="message-block_content">
                            <div className="message-block_content_text">
                                <h1 className="message-block_content__title">Поздравляем</h1>
                                <h2 className="message-block_content__subtitle">{message.employee}</h2>

                                <p className="message-block_content__txt">
                                    Сделка прошла успешно!
                                </p>
                            </div>

                            <div className="message-block_content__results">
                                <div className="block-result block-result__project">
                                    {message.project}
                                </div>

                                <div className="block-result block-result__value">
                                    {message.value && message.currency && formatNumber(message.value, message.currency)}
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Drawer>
        </div>
    )
}

export default MainPage;