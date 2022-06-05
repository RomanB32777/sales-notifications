import axiosClient from "../../utils/axiosClient"
// import catchErrors from "../../utils/catchErrors"
import { types } from "../types"

const messagesApi = {
    getAllByDialogId: (id) => axiosClient.get(`/api/v1/chats/messages/${id}/`),
    removeById: (id) => axiosClient.delete(`/api/v1/chats/messages?id=${id}`),
    send: (text, dialogId, attachments) =>
        axiosClient.post("/messages", {
            text: text,
            dialog_id: dialogId,
            attachments,
        }),
}

export const messagesAsync = {
    setMessages: (items) => ({
        type: types.setMessagesItems,
        payload: items,
    }),
    addMessage: ({ message, room, dialogID }) => (dispatch, getState) => {
        const { dialogs, user } = getState()
        const { currentDialogId, items } = dialogs

        // скорее всего нужна будет проверка на подключение пользователя
        const dialog = items.length && items.find(i => i.pk === +dialogID)
        const partner = dialog.current_users && dialog.current_users.length && dialog.current_users.find(u => u.id !== user.id)
        message && partner && window.socket && window.socket.send(JSON.stringify({
            action: "sent_new_message",
            message: message.id,
            partner: partner.id,
        }))

        if (currentDialogId == room) {
            dispatch({
                type: types.addMessage,
                payload: message,
            })
        }
    },
    updateLastMessage: (data) => (dispatch) => {
        dispatch({
            type: types.updateLastMessage,
            payload: data,
        })
    },
    updateOnlinePartnerStatus: (data) => (dispatch) => {
        dispatch({
            type: types.updateOnlinePartnerStatus,
            payload: data,
        })
    },
    fetchSendMessage: ({ text, dialogId, attachments }) => (dispatch) => {
        return messagesApi.send(text, dialogId, attachments)
    },
    setIsLoading: (bool) => ({
        type: types.setMessagesLoading,
        payload: bool,
    }),
    removeMessageById: (id) => (dispatch) => {
        if (window.confirm("Вы действительно хотите удалить сообщение?")) {
            messagesApi
                .removeById(id)
                .then(({ data }) => {
                    dispatch({
                        type: types.removeMessage,
                        payload: id,
                    })
                })
                .catch(() => {
                    dispatch(messagesAsync.setIsLoading(false))
                })
        }
    },
    fetchMessages: (dialogId) => (dispatch) => {
        dispatch(messagesAsync.setIsLoading(true))
        messagesApi
            .getAllByDialogId(dialogId)
            .then(({ data }) => {
                dispatch(messagesAsync.setMessages(data))
            })
            .catch(() => {
                dispatch(messagesAsync.setIsLoading(false))
            })
    },
}