import { Badge } from "antd";
import type { ColumnsType } from "antd/es/table";
import { IFilterSettings, ITransactionTopList } from "../../types";
import { formatNumber, getFilterSettings } from "../../utils";

export const tableColumns: ColumnsType<ITransactionTopList> = [
  {
    title: "Фото",
    dataIndex: "employee_photo",
    key: "employee_photo",
    width: "10%",
    align: "center",
    render: (employee_photo: string, { employee_name }, index) => (
      <div className="list-employee-photo">
        {}
        {index === 0 ? (
          <Badge.Ribbon
            text="1 Место"
            color="green"
            children={
              <img alt={employee_name} src={`/images/${employee_photo}`} />
            }
          />
        ) : (
          <img alt={employee_name} src={`/images/${employee_photo}`} />
        )}
      </div>
    ),
  },
  {
    title: "Брокер",
    dataIndex: "employee_name",
    key: "employee_name",
    width: "25%",
    align: "center",
  },
  {
    title: "Общая сумма",
    dataIndex: "sum_transactions",
    key: "sum_transactions",
    width: "20%",
    align: "center",
    render: (sum) => {
      const settings: IFilterSettings = getFilterSettings();
      return <>{sum && formatNumber(sum, settings.currency)}</>;
    },
  },
  // parseFloat(sum).toFixed(2)
];
