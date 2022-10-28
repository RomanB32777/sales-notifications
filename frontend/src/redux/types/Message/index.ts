import { IMessage } from "../../../types";

export const SET_MESSAGE = "SET_MESSAGE";
export const SHOW_MESSAGE = "SHOW_MESSAGE";
export const HIDE_MESSAGE = "HIDE_MESSAGE";

export const setMessage = (payload: IMessage) => ({
  type: SET_MESSAGE,
  payload,
});

export const showMessage = () => ({
  type: SHOW_MESSAGE,
});

export const hideMessage = () => ({
  type: HIDE_MESSAGE,
});
