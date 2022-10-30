import { ISettings } from "../../../types";

export const GET_SETTINGS = "GET_SETTINGS";
export const SET_SETTINGS = "SET_SETTINGS";

export const getSettings = () => ({
  type: GET_SETTINGS
});

export const setSettings = (payload: ISettings) => {
  return { type: SET_SETTINGS, payload };
};