import React, { createContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { clearError, hideLoading, loginUser, showLoading } from '../redux/actions/appActions';
import { types } from '../redux/types';

const WebSocketContext = createContext(null)

export { WebSocketContext }

export const WebSocketProvider = ({ children }) => {
    const [valueContext, setValueContext] = useState({ socket: null });
    const dispatch = useDispatch()

    useEffect(() => {
        const isAuth = localStorage.getItem('isAuth')
        isAuth && dispatch(loginUser())

        const socket = io(`http://${window.location.hostname}:${process.env.REACT_APP_BACKEND_PORT || 5000}/`)

        dispatch(showLoading())

        socket.on('connect', () => {
            console.log("connect");
            dispatch(clearError())
            dispatch(hideLoading())
        });

        socket.on("connect_error", () => {
            dispatch({
                type: types.setError,
                payload: {
                    message: 'Ошибка соединения',
                    description: 'Попробуйте перезагрузить сайт или обратитесь к разработчику'
                }
            })
            dispatch(hideLoading())
        });

        socket.on("disconnect", () => {
            console.log("disconnect");
        });

        socket.on("add_mess", (data) => {
            dispatch({
                type: types.setMessage,
                payload: { ...data, isNewMessage: true }
            })
        })

        setValueContext({ socket })

        return () => { socket.disconnect() }
    }, [dispatch])


    return (
        <WebSocketContext.Provider value={valueContext}>
            {children}
        </WebSocketContext.Provider>
    )
}