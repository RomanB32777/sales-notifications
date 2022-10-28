import { call, put, takeEvery } from "redux-saga/effects";
import axiosClient from "../../axiosClient";
import { setLoading } from "../../redux/types/Loading";
import { setEmployees, GET_EMPLOYEES } from "../../redux/types/Employees";

const asyncGetEmployees = async () => {
  const response = await axiosClient.get("/api/employee/");
  if (response.status === 200) {
    return response.data;
  }
};

function* EmployeesWorker(): any {
  yield put(setLoading(true));
  const data: any = yield call(asyncGetEmployees);
  if (data) {
    yield put(setEmployees(data));
  }
  yield put(setLoading(false));
}

export function* EmployeesWatcher() {
  yield takeEvery(GET_EMPLOYEES, EmployeesWorker);
}
