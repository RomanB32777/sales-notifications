import React, { createContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import SocketIOFileUpload from 'socketio-file-upload'
import { loginUser } from '../redux/actions/appActions';
import { types } from '../redux/types';

const WebSocketContext = createContext(null)

export { WebSocketContext }

export const WebSocketProvider = ({ children }) => {
    const [valueContext, setValueContext] = useState({ socket: null });
    const dispatch = useDispatch()

    useEffect(() => {
        const isAuth = localStorage.getItem('isAuth')
        isAuth && dispatch(loginUser())

        const socket = io('http://78.24.217.40:5000/')

        const uploader = new SocketIOFileUpload(socket);


        socket.on('connect', () => {
            console.log("connect");
        });

        socket.on("connect_error", () => {
            console.log("connect_error");
        });

        socket.on("disconnect", () => {
            console.log("disconnect");
        });

        socket.on("add_mess", (data) => {
            dispatch({
                type: types.setMessage,
                payload: {...data, isNewMessage: true}
            })
        })

        setValueContext({ socket, uploader })

        return () => { socket.disconnect() }
    }, [])


    return (
        <WebSocketContext.Provider value={valueContext}>
            {children}
        </WebSocketContext.Provider>
    )
}