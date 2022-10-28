import { IEmployee, IEmployeeAction } from "../../../types";
import { SET_EMPLOYEES } from "../../types/Employees";

const initialState: IEmployee[] = [];

const EmployeesReducer = (
  state = initialState,
  action: IEmployeeAction
) => {
  switch (action.type) {
    case SET_EMPLOYEES:
      return action.payload;

    default:
      return state;
  }
};

export default EmployeesReducer;
