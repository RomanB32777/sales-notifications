import type { ColumnsType } from "antd/es/table";
import { IEmployee, ITransactionList } from "../../../types";
import {
  DateFormatter,
  DateTimezoneFormatter,
  formatNumber,
} from "../../../utils";

export const tableColumns: ColumnsType<ITransactionList> = [
  {
    title: "Брокер/-ы",
    dataIndex: "employees",
    key: "employees",
    width: "15%",
    align: "center",
    render: (value: IEmployee[]) => value.map((e) => e.employee_name).join("/"),
  },
  {
    title: "Сумма сделки",
    dataIndex: "transaction_value",
    key: "transaction_value",
    width: "15%",
    align: "center",
    render: (value, { currency }) => currency && formatNumber(value, currency),
    sorter: (a, b) => a.transaction_value - b.transaction_value,
  },
  {
    title: "Проект",
    dataIndex: "project_name",
    key: "project_name",
    width: "30%",
    align: "center",
  },
  {
    title: "Дата/время сделки, UTC",
    dataIndex: "created_at",
    key: "created_at",
    width: "25%",
    align: "center",
    render: (text) =>
      Date.parse(text) ? DateFormatter(DateTimezoneFormatter(text)) : "-",
    sorter: (a, b) =>
      Date.parse(a.created_at) &&
      Date.parse(b.created_at) &&
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  },
];
