import { IEmployee } from "../../../types";

export const GET_EMPLOYEES = "GET_EMPLOYEES";
export const SET_EMPLOYEES = "SET_EMPLOYEES";

export const getEmployees = () => ({
  type: GET_EMPLOYEES
});

export const setEmployees = (payload: IEmployee[]) => {
  return { type: SET_EMPLOYEES, payload };
};