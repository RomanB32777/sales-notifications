import { all } from "redux-saga/effects";
import { EmployeesWatcher } from "./Employees/EmployeesWatcher";
import { TransactionsWatcher } from "./Transactions/TransactionsWatcher";

export function* rootWatcher() {
  yield all([EmployeesWatcher(), TransactionsWatcher()]);
}
