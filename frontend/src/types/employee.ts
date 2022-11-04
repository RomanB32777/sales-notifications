export interface IEmployeeShort {
  employee_name: string;
  employee_photo: string;
}

export interface IEmployee extends IEmployeeShort {
  id: number;
  created_at?: string;
}

export interface IEmployeeFull extends IEmployee {
  employees?: IEmployee[]; // CooperativeEmployee
}

export interface IEmployeeAction {
  type: string;
  payload: IEmployeeFull[];
}
