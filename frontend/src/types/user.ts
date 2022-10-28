export interface IUser {
  isAuth: boolean;
  password: string;
}

export interface IUserAction {
  type: string;
  payload?: IUser;
}