import { call, put, takeEvery } from "redux-saga/effects";
import axiosClient from "../../axiosClient";
import { setLoading } from "../../redux/types/Loading";
import { setSettings, GET_SETTINGS } from "../../redux/types/Settings";

const asyncGetSettings = async () => {
  const response = await axiosClient.get("/api/settings/");
  if (response.status === 200) {
    return response.data;
  }
};

function* SettingsWorker(): any {
  yield put(setLoading(true));
  const data: any = yield call(asyncGetSettings);
  if (data) {
    yield put(setSettings(data));
  }
  yield put(setLoading(false));
}

export function* SettingsWatcher() {
  yield takeEvery(GET_SETTINGS, SettingsWorker);
}
