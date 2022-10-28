import { ICurrenciesTypes } from ".";
import { IEmployeeShort } from "./employee";

export interface ITransactionShort {
  project_name: string;
  transaction_value: number;
  currency: ICurrenciesTypes;
  employee_id: number;
}

export interface ITransaction extends ITransactionShort {
  id: number;
  created_at: string;
}

export interface ITransactionFull extends ITransaction, IEmployeeShort {}

export interface ITransactionTopList extends IEmployeeShort {
  id: number;
  sum_transactions: string
}

export interface ITransactionsAction {
  type: string;
  payload: ITransactionFull[] | ITransactionTopList[];
}
