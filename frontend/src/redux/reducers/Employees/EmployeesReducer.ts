import { IEmployeeFull, IEmployeeAction } from "../../../types";
import { SET_EMPLOYEES } from "../../types/Employees";

const initialState: IEmployeeFull[] = [];

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
