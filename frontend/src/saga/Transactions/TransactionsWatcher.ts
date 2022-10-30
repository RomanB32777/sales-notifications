import { call, put, takeEvery } from "redux-saga/effects";
import axiosClient from "../../axiosClient";
import { setLoading } from "../../redux/types/Loading";
import {
  setTransactions,
  setTransactionsTop,
  GET_TRANSACTIONS,
  GET_TRANSACTIONS_TOP,
} from "../../redux/types/Transactions";
import { ISettings } from "../../types";

const asyncGetTransactions = async () => {
  const response = await axiosClient.get("/api/transaction/");
  if (response.status === 200) {
    return response.data;
  }
};

const asyncGetTransactionsTop = async (settings: ISettings) => {
  const notInQueryFilterFields = ["duration_congratulation", "id"];
  
  const queryParams = Object.keys(settings)
    .filter((key) => !notInQueryFilterFields.includes(key as keyof ISettings))
    .map((key) => `${key}=${settings[key as keyof ISettings]}`)
    .join("&");

  const url = `/api/transaction/?${queryParams}`;
  const response = await axiosClient.get(url);
  if (response.status === 200) {
    return response.data;
  }
};

function* TransactionsWorker(): any {
  yield put(setLoading(true));
  const data: any = yield call(asyncGetTransactions);
  if (data) {
    yield put(setTransactions(data));
  }
  yield put(setLoading(false));
}

function* TransactionsTopWorker(action: any): any {
  yield put(setLoading(true));
  const data: any = yield call(asyncGetTransactionsTop, action.payload);
  if (data) {
    yield put(setTransactionsTop(data));
  }
  yield put(setLoading(false));
}

export function* TransactionsWatcher() {
  yield takeEvery(GET_TRANSACTIONS, TransactionsWorker);
  yield takeEvery(GET_TRANSACTIONS_TOP, TransactionsTopWorker);
}
