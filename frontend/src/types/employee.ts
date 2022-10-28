export interface IEmployeeShort {
  employee_name: string;
  employee_photo: string;
}

export interface IEmployee extends IEmployeeShort {
  id: number;
  created_at: string;
}

export interface IEmployeeAction {
  type: string;
  payload: IEmployee[];
}