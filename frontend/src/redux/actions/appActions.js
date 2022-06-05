import { types } from "../types";

export const appActions = {
    [types.DEFAULT]: (state) => {
        return { ...state }
    },
    [types.showLoading]: (state) => {
        return { ...state, loading: true }
    },
    [types.hideLoading]: (state) => {
        return { ...state, loading: false }
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
    [types.setError]: (state, action) => {
        return { ...state, error: { ...action.payload } }
    },
    [types.clearError]: (state) => {
        return { ...state, error: {} }
    }
};

export const showLoading = () => ({
    type: types.showLoading
});

export const hideLoading = () => ({
    type: types.hideLoading
});

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

export const clearError = () => (dispatch, getState) => {
    const { error } = getState()
    !!Object.keys(error).length && dispatch({ type: types.clearError })
}