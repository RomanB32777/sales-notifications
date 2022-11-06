import { useEffect, useState } from "react";
import { Input, Select } from "antd";

import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { getTransactions } from "../../../redux/types/Transactions";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

import LayoutBlock from "../../../components/LayoutBlock";
import TableComponent from "../../../components/TableComponent";
import ConfirmPopup from "../../../components/ConfirmPopup";
import ModalComponent from "../../../components/ModalComponent";
import TransactionFormBlock, { IFormTransactionData } from "../transactionForm";
import axiosClient from "../../../axiosClient";
import { ITransactionFilterFieldsKeys, ITransactionList } from "../../../types";
import { tableColumns } from "./tableData";
import { getEmployees } from "../../../redux/types/Employees";
import {
  filterTransactionFields,
  inclinedFilterTransactionFields,
} from "../../../consts";

const { Search } = Input;

const TransactionsBlock = ({ socket }: { socket: any }) => {
  const dispatch = useAppDispatch();
  const { loading, transactions, settings } = useAppSelector((state) => state);

  const [tableData, setTableData] = useState<ITransactionList[]>([]);
  const [editedTransaction, setEditedTransaction] =
    useState<IFormTransactionData | null>(null);
  const [selectedFilterField, setSelectedFilterField] =
    useState<ITransactionFilterFieldsKeys>("project_name");

  const { transactions_full } = transactions;

  const updateLists = () => {
    dispatch(getEmployees());
    dispatch(getTransactions());
  };

  const deleteTransaction = async (id: number) => {
    const deleted_transaction = await axiosClient.delete(
      `/api/transaction/${id}`
    );
    if (deleted_transaction.status === 200) {
      updateLists();
      socket.emit("update_table", settings);
    }
  };

  const onChangeFilterField = (value: ITransactionFilterFieldsKeys) =>
    setSelectedFilterField(value);

  const onSearch = (value: string) => {
    const filteredTableData = transactions_full.length
      ? transactions_full
          .filter((transaction) => {
            switch (selectedFilterField) {
              case "employees":
                return transaction[selectedFilterField].some(
                  ({ employee_name }) =>
                    employee_name.toUpperCase().includes(value.toUpperCase())
                );

              case "project_name":
                return transaction[selectedFilterField]
                  .toUpperCase()
                  .includes(value.toUpperCase());

              case "currency":
                return transaction[selectedFilterField]
                  .toUpperCase()
                  .includes(value.toUpperCase());

              case "transaction_value":
                return String(transaction[selectedFilterField])
                  .toUpperCase()
                  .includes(value.toUpperCase());

              default:
                return transaction[selectedFilterField];
            }
          })
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
            <Select
              value={selectedFilterField}
              options={filterTransactionFields}
              onChange={onChangeFilterField}
              placeholder="Фильтрация по..."
              className="filter-select"
              style={{ width: 180, marginRight: 20 }}
            />
            <Search
              placeholder={`Найти сделки по ${inclinedFilterTransactionFields[selectedFilterField]}`}
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
                  <EditOutlined
                    onClick={() => openEditModal(transaction)}
                    style={{ cursor: "pointer", fontSize: 20, marginRight: 20 }}
                  />
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
        width={1000}
      >
        <TransactionFormBlock
          transaction={editedTransaction}
          socket={socket}
          layout={{
            wrapperCol: { span: 21 },
            labelCol: { span: 3 },
            labelWrap: true,
          }}
          successMethod={closeModal}
        />
      </ModalComponent>
    </>
  );
};

export default TransactionsBlock;
