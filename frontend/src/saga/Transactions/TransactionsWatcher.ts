import { call, put, takeEvery } from "redux-saga/effects";
import axiosClient from "../../axiosClient";
import { setLoading } from "../../redux/types/Loading";
import {
  setTransactions,
  GET_TRANSACTIONS,
} from "../../redux/types/Transactions";
import { IFilterSettings } from "../../types";

const asyncGetTransactions = async (settings: IFilterSettings) => {
  const url = `/api/transaction/${
    settings
      ? `?time_period=${settings.time_period}&currency=${settings.currency}`
      : ""
  }`;
  const response = await axiosClient.get(url);
  if (response.status === 200) {
    return response.data;
  }
};

function* TransactionsWorker(action: any): any {
  yield put(setLoading(true));
  const data: any = yield call(asyncGetTransactions, action.payload);
  if (data) {
    yield put(setTransactions(data));
  }
  yield put(setLoading(false));
}

export function* TransactionsWatcher() {
  yield takeEvery(GET_TRANSACTIONS, TransactionsWorker);
}
