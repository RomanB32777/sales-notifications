import { IAnyAction } from "../../../types";
import { SET_ERROR } from "../../types/Error";

const initialState = {};

const ErrorReducer = (state = initialState, action: IAnyAction) => {
  switch (action.type) {
    case SET_ERROR:
      return action.payload;

    default:
      return state;
  }
};

export default ErrorReducer;
