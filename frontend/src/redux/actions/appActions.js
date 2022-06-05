import { types } from "../types";

export const appActions = {
    [types.DEFAULT]: (state) => {
        return { ...state }
    },
    [types.login]: (state) => {
        return { ...state, user: { ...state.user, isAuth: true } }
    },
    [types.logout]: (state) => {
        return { ...state, user: { ...state.user, isAuth: false } }
    },
    [types.setMessage]: (state, { payload }) => {
        return { ...state, message: { ...payload, active: true } }
    },
    [types.showMessage]: (state) => {
        return { ...state, message: { ...state.message, active: true } }
    },
    [types.hideMessage]: (state) => {
        return { ...state, message: { ...state.message, active: false, isNewMessage: false } }
    },
};

export const hideDrawer = () => ({
    type: types.hideMessage
});

export const showDrawer = () => ({
    type: types.showMessage
});

export const loginUser = () => ({
    type: types.login
});

export const logoutUser = () => ({
    type: types.logout
});