import type { ColumnsType } from "antd/es/table";
import { currencyTypes } from "../../../consts";
import { ITransaction } from "../../../types";
import { DateFormatter, DateTimezoneFormatter } from "../../../utils";

interface ITableData extends ITransaction {
  employee_name: string;
}

export const tableColumns: ColumnsType<ITransaction> = [
  {
    title: "Брокер",
    dataIndex: "employee_name",
    key: "employee_name",
    width: "15%",
    align: "center",
  },
  {
    title: "Сумма сделки",
    dataIndex: "transaction_value",
    key: "transaction_value",
    width: "15%",
    align: "center",
    render: (text, { currency }) => text + ` ${currencyTypes[currency]}`,
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

export type { ITableData };
