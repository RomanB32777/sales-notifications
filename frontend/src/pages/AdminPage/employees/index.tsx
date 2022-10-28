import { Avatar, Button, List } from "antd";
import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { getEmployees } from "../../../redux/types/Employees";

import axiosClient from "../../../axiosClient";
import { getTransactions } from "../../../redux/types/Transactions";
import LayoutBlock from "../../../components/LayoutBlock";
import ConfirmPopup from "../../../components/ConfirmPopup";
import "./style.scss";

const EmployeesBlock = () => {
  const dispatch = useAppDispatch();
  const { employees, loading } = useAppSelector((state) => state);

  const deleteEmployee = async (id: number) => {
    const deleted_transaction = await axiosClient.delete(`/api/employee/${id}`);
    if (deleted_transaction.status === 200) {
      dispatch(getEmployees());
      dispatch(getTransactions());
    }
  };

  useEffect(() => {
    dispatch(getEmployees());
  }, []);

  return (
    <LayoutBlock title={"Сотрудники"}>
      <List
        className="employees-list"
        loading={loading}
        itemLayout="horizontal"
        grid={{ gutter: 48, column: 2 }}
        dataSource={employees}
        pagination={{
          total: employees.length,
          pageSize: 5,
          hideOnSinglePage: true,
        }}
        renderItem={({ id, employee_photo, employee_name }) => (
          <List.Item
            style={{ display: "flex" }}
            actions={[
              <ConfirmPopup confirm={() => deleteEmployee(id)}>
                <Button type="primary" danger>
                  Удалить
                </Button>
              </ConfirmPopup>,
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar size={100} src={employee_photo} />}
              title={employee_name}
            />
          </List.Item>
        )}
      />
    </LayoutBlock>
  );
};

export default EmployeesBlock;
