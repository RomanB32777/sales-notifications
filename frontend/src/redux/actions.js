import { appActions } from "./actions/appActions";
import { types } from "./types";

export const actions = {
    [types.DEFAULT]: (state) => {
        return { ...state }
    },
    ...appActions,
}