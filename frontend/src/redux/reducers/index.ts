import { combineReducers } from "redux";
import EmployeesReducer from "./Employees/EmployeesReducer";
import TransactionsReducer from "./Transactions/TransactionsReducer";
import LoadingReducer from "./Loading/LoadingReducer";
import MessageReducer from "./Message/MessageReducer";
import UserReducer from "./User/UserReducer";
import ErrorReducer from "./Error/ErrorReducer";

const store = {
  employees: EmployeesReducer,
  transactions: TransactionsReducer,
  user: UserReducer,
  message: MessageReducer,
  error: ErrorReducer,
  loading: LoadingReducer,
};

const rootReducer = combineReducers(store);

export { rootReducer };
