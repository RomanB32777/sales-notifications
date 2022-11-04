import { SET_MESSAGE, SHOW_MESSAGE, HIDE_MESSAGE } from "../../types/Message";
import { IMessage, IMessageAction } from "../../../types";
import { init_filter_settings } from "../../../consts";

const initialState: IMessage = {
  active: false,
  id: 0,
  employees: [],
  transaction_value: 0,
  currency: init_filter_settings.currency,
  created_at: "",
  project_name: "",
};

const showMessageAction = (state: IMessage): IMessage => ({
  ...state,
  active: true,
});

const hideMessageAction = (state: IMessage): IMessage => ({
  ...state,
  active: false,
  isNewMessage: false,
});

const MessageReducer = (state = initialState, action: IMessageAction) => {
  switch (action.type) {
    case SET_MESSAGE:
      return {
        ...state,
        ...action.payload,
      };

    case SHOW_MESSAGE:
      return showMessageAction(state);

    case HIDE_MESSAGE:
      return hideMessageAction(state);

    default:
      return state;
  }
};

export default MessageReducer;
