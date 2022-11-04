import { ISettings, ITransactionList, ITransactionTopList } from "../../../types";

export const GET_TRANSACTIONS = "GET_TRANSACTIONS";
export const SET_TRANSACTIONS = "SET_TRANSACTIONS";

export const GET_TRANSACTIONS_TOP = "GET_TRANSACTIONS_TOP";
export const SET_TRANSACTIONS_TOP = "SET_TRANSACTIONS_TOP";


export const getTransactions = () => ({
  type: GET_TRANSACTIONS
});

export const getTransactionsTop = (payload: ISettings) => ({
  type: GET_TRANSACTIONS_TOP, payload
});

export const setTransactions = (payload: ITransactionList[]) => {
  return { type: SET_TRANSACTIONS, payload };
};

export const setTransactionsTop = (payload: ITransactionTopList[]) => {
  return { type: SET_TRANSACTIONS_TOP, payload };
};