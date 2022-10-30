import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { getTransactions } from "../../../redux/types/Transactions";
import { DeleteOutlined } from "@ant-design/icons";

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

  const { transactions_full } = transactions;

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
    const forTableData = transactions_full.length
      ? transactions_full.map((transaction) => ({
          ...transaction,
          key: transaction.id,
        }))
      : [];
    setTableData(forTableData as ITransaction[]);
  }, [transactions_full]);

  return (
    <LayoutBlock title={"Сделки"}>
      <TableComponent
        loading={loading}
        dataSource={tableData}
        columns={[
          ...tableColumns,
          {
            title: "Действия",
            dataIndex: "",
            key: "x",
            align: "center",
            render: (_: any, { id }) => (
              <ConfirmPopup confirm={() => deleteTransaction(id)}>
                <DeleteOutlined style={{ color: "red", fontSize: 20 }} />
              </ConfirmPopup>
            ),
          },
        ]}
        pagination={{
          total: transactions_full.length,
          pageSize: 10,
          position: ["bottomRight"],
          hideOnSinglePage: true,
        }}
      />
    </LayoutBlock>
  );
};

export default TransactionsBlock;
