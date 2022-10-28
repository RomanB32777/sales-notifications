import { ILoadingAction } from "../../../types";
import { SET_LOADING } from "../../types/Loading";

const initialState = false;

const LoadingReducer = (state = initialState, action: ILoadingAction) => {
  switch (action.type) {
    case SET_LOADING:
      return action.payload;

    default:
      return state;
  }
};

export default LoadingReducer;
