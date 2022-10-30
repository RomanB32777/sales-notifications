import { SET_SETTINGS } from "../../types/Settings";
import { init_filter_settings } from "../../../consts";
import { ISettingsAction } from "../../../types/settings";

const SettingsReducer = (
  state = init_filter_settings,
  action: ISettingsAction
) => {
  switch (action.type) {
    case SET_SETTINGS:
      return action.payload;

    default:
      return state;
  }
};

export default SettingsReducer;
