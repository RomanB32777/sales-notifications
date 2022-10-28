import { IUser, IUserAction } from "../../../types";
import { LOGIN, LOGOUT } from "../../types/User";

const initialState: IUser = {
  isAuth: false,
  password: "123",
};

const loginAction = (state: IUser): IUser => ({
  ...state,
  isAuth: true,
});
const logoutAction = (state: IUser): IUser => ({
  ...state,
  isAuth: false,
});

const UserReducer = (state = initialState, action: IUserAction) => {
  switch (action.type) {
    case LOGIN:
      return loginAction(state);

    case LOGOUT:
      return logoutAction(state);

    default:
      return state;
  }
};

export default UserReducer;
