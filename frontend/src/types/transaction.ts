import { ICurrenciesTypes } from ".";
import { IEmployee, IEmployeeShort } from "./employee";

export interface ITransactionShort {
  project_name: string;
  transaction_value: number;
  currency: ICurrenciesTypes;
  // employee_id: number;
}

export interface ITransaction extends ITransactionShort {
  id: number;
  created_at: string;
}

export interface ITransactionFull extends ITransaction, IEmployeeShort {}

export interface ITransactionTopList {
  employees: IEmployee[];
  sum_transactions?: number;
}

export interface ITransactionList extends ITransaction {
  employees: IEmployee[];
}

export interface ITopList {
  top_level: ITransactionTopList[];
  middle_level: ITransactionTopList[];
  low_level: ITransactionTopList[];
  zero_level: ITransactionTopList[];
}

export interface ITransactionsState {
  transactions_full: ITransactionList[];
  transactions_top: ITopList;
}

export interface ITransactionsAction {
  type: string;
  payload: ITransactionList[] | ITopList;
}
