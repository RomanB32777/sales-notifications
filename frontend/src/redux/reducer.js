import { actions } from "./actions";
import { initialState } from "./initialState";
import { types } from "./types";

export const reducer = (state = initialState, action) => {
    const handler = actions[action.type] || actions[types.DEFAULT] 
    return handler(state, action)
}