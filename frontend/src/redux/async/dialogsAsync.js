import axiosClient from "../../utils/axiosClient"
import { getToken } from "../../utils/storage"
import { types } from "../types"
import { messagesAsync } from "./messagesAsync"

export const dialogsApi = {
    getAll: () => axiosClient.get("/api/v1/chats/dialogs/"),
    create: ({ partner, name }) => axiosClient.post(
        "/api/v1/chats/create/",
        { partner, name },
        {
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${getToken()}`

            }
        }),
}

export const dialogsAsync = {
    setDialogs: (items) => {
        return ({
            type: types.setDialogsItems,
            payload: items,
        })
    },
    addDialog: (item) => {
        return ({
            type: types.addDialog,
            payload: item,
        })
    },
    setWelcomeMessage: (message, room) => (dispatch) => {
        const { addMessage } = messagesAsync
        dispatch(addMessage({ message, room }))
    },
    setCurrentDialogId: (id) => (dispatch) => {
        dispatch({
            type: types.setCurrentDialogID,
            payload: id,
        })
    },
    fetchDialogs: () => (dispatch) => {
        dialogsApi.getAll().then(({ data }) => {
            dispatch(dialogsAsync.setDialogs(data))
        })
    },
}



    // fetchDialogs: (ws) => {
    //     const request_id = new Date().getTime()
    //     ws.send(
    //         JSON.stringify({
    //             action: "get_user_chats",
    //             request_id: request_id,
    //         })
    //     );
    // }

        // socket.emit("DIALOGS:JOIN", id)
        // const request_id = new Date().getTime()
        // ws.send(
        //     JSON.stringify({
        //         pk: id,
        //         action: "join_room",
        //         request_id: request_id,
        //     })
        // );
        // ws.send(
        //     JSON.stringify({
        //         pk: id,
        //         action: "retrieve",
        //         request_id: request_id,
        //     })
        // );
        // ws.send(
        //     JSON.stringify({
        //         pk: id,
        //         action: "subscribe_to_messages_in_room",
        //         request_id: request_id,
        //     })
        // );
        // ws.send(
        //     JSON.stringify({
        //         pk: id,
        //         action: "subscribe_instance",
        //         request_id: request_id,
        //     })
        // );