import { IFilterSettings, ITransactionFull } from "../../../types";

export const GET_TRANSACTIONS = "GET_TRANSACTIONS";
export const SET_TRANSACTIONS = "SET_TRANSACTIONS";

export const getTransactions = (payload?: IFilterSettings) => ({
  type: GET_TRANSACTIONS, payload
});

export const setTransactions = (payload: ITransactionFull[]) => {
  return { type: SET_TRANSACTIONS, payload };
};