import { useEffect, useState } from "react";

import { Button } from "antd";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { getTransactions } from "../../../redux/types/Transactions";

import axiosClient from "../../../axiosClient";
import LayoutBlock from "../../../components/LayoutBlock";
import TableComponent from "../../../components/TableComponent";
import ConfirmPopup from "../../../components/ConfirmPopup";
import { ITransaction } from "../../../types";
import { tableColumns } from "./tableData";

const TransactionsBlock = () => {
  const dispatch = useAppDispatch();
  const { loading, transactions } = useAppSelector((state) => state);

  const [tableData, setTableData] = useState<ITransaction[]>([]);
  // const getListData = useCallback(() => dispatch(getEmployees()), []); // ?

  const deleteTransaction = async (id: number) => {
    const deleted_transaction = await axiosClient.delete(
      `/api/transaction/${id}`
    );
    deleted_transaction.status === 200 && dispatch(getTransactions());
  };

  useEffect(() => {
    dispatch(getTransactions());
  }, []);

  useEffect(() => {
    if (transactions.length) {
      const forTableData = transactions.map((transaction) => ({
        ...transaction,
        key: transaction.id,
      }));
      forTableData.length && setTableData(forTableData as ITransaction[]);
    }
  }, [transactions]);

  return (
    <LayoutBlock title={"Сделки"}>
      <TableComponent
        loading={loading}
        dataSource={tableData}
        columns={[
          ...tableColumns,
          {
            title: "Action",
            dataIndex: "",
            key: "x",
            align: "center",
            render: (_: any, { id }) => (
              <ConfirmPopup confirm={() => deleteTransaction(id)}>
                <Button type="primary" danger>
                  Удалить
                </Button>
              </ConfirmPopup>
            ),
          },
        ]}
        pagination={{
          total: transactions.length,
          pageSize: 10,
          position: ["bottomRight"],
          hideOnSinglePage: true,
        }}
      />
    </LayoutBlock>
  );
};

export default TransactionsBlock;
