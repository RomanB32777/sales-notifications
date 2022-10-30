import { combineReducers } from "redux";
import EmployeesReducer from "./Employees/EmployeesReducer";
import TransactionsReducer from "./Transactions/TransactionsReducer";
import UserReducer from "./User/UserReducer";
import MessageReducer from "./Message/MessageReducer";
import SettingsReducer from "./Settings/SettingsReducer";
import ErrorReducer from "./Error/ErrorReducer";
import LoadingReducer from "./Loading/LoadingReducer";

const store = {
  employees: EmployeesReducer,
  transactions: TransactionsReducer,
  user: UserReducer,
  message: MessageReducer,
  settings: SettingsReducer,
  error: ErrorReducer,
  loading: LoadingReducer,
};

const rootReducer = combineReducers(store);

export { rootReducer };
