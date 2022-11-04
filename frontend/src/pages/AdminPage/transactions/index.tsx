import { useContext, useEffect, useState } from "react";
import { Input } from "antd";

import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { getTransactions } from "../../../redux/types/Transactions";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

import { WebSocketContext } from "../../../components/WebSocket";
import LayoutBlock from "../../../components/LayoutBlock";
import TableComponent from "../../../components/TableComponent";
import ConfirmPopup from "../../../components/ConfirmPopup";
import ModalComponent from "../../../components/ModalComponent";
import TransactionFormBlock, {
  IFormTransactionData,
} from "../transactionForm";
import axiosClient from "../../../axiosClient";
import { ITransactionList } from "../../../types";
import { tableColumns } from "./tableData";
import { getEmployees } from "../../../redux/types/Employees";

const { Search } = Input;

const TransactionsBlock = () => {
  const dispatch = useAppDispatch();
  const { loading, transactions, settings } = useAppSelector((state) => state);
  const socket = useContext(WebSocketContext);

  const [tableData, setTableData] = useState<ITransactionList[]>([]);
  const [editedTransaction, setEditedTransaction] =
    useState<IFormTransactionData | null>(null);

  const { transactions_full } = transactions;

  const updateLists = () => {
    dispatch(getEmployees());
    dispatch(getTransactions());
  };

  const deleteTransaction = async (id: number) => {
    const deleted_transaction = await axiosClient.delete(
      `/api/transaction/${id}`
    );
    if (deleted_transaction.status === 200 && socket) {
      updateLists();
      socket.emit("update_table", settings);
    }
  };

  const onSearch = (name: string) => {
    const filteredTableData = transactions_full.length
      ? transactions_full
          .filter(({ project_name }) => project_name.includes(name))
          .map((transaction) => ({
            ...transaction,
            key: transaction.id,
          }))
      : [];
    setTableData(filteredTableData as ITransactionList[]);
  };

  const openEditModal = (transaction: ITransactionList) => {
    setEditedTransaction({
      ...transaction,
      employees: transaction.employees.map(({ id }) => id),
    });
  };

  const closeModal = () => setEditedTransaction(null);

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
    setTableData(forTableData as ITransactionList[]);
  }, [transactions_full]);

  return (
    <>
      <LayoutBlock
        title={"Сделки"}
        headerElements={
          <>
            <Search
              placeholder="Найти сделки по названию проекта"
              onSearch={onSearch}
              style={{ width: 350 }}
              allowClear
              enterButton
            />
          </>
        }
      >
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
              render: (_: any, transaction) => (
                <>
                  {/* <EditOutlined
                    onClick={() => openEditModal(transaction)}
                    style={{ cursor: "pointer", fontSize: 20, marginRight: 20 }}
                  /> */}
                  <ConfirmPopup
                    confirm={() => deleteTransaction(transaction.id)}
                  >
                    <DeleteOutlined style={{ color: "red", fontSize: 20 }} />
                  </ConfirmPopup>
                </>
              ),
            },
          ]}
          pagination={{
            total: tableData.length,
            pageSize: 10,
            position: ["bottomRight"],
            hideOnSinglePage: true,
          }}
        />
      </LayoutBlock>
      <ModalComponent
        open={Boolean(editedTransaction)}
        title="Редактировать сделку"
        onCancel={closeModal}
        width={880}
      >
        <TransactionFormBlock transaction={editedTransaction} />
      </ModalComponent>
    </>
  );
};

export default TransactionsBlock;
