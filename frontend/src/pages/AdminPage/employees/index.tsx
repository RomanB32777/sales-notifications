import { useEffect, useState } from "react";
import { Avatar, Button, Form, Input, List, message } from "antd";
import type { RcFile, UploadProps } from "antd/es/upload/interface";
import { UserDeleteOutlined, EditOutlined } from "@ant-design/icons";

import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { getEmployees } from "../../../redux/types/Employees";
import axiosClient from "../../../axiosClient";

import { getTransactions } from "../../../redux/types/Transactions";
import LayoutBlock from "../../../components/LayoutBlock";
import ModalComponent from "../../../components/ModalComponent";
import ConfirmPopup from "../../../components/ConfirmPopup";
import UploadPhoto from "../../../components/UploadPhoto";
import Collage from "../../../components/Collage";
import { sendDataWithFile } from "../../../utils";
import { IEmployeeFull, IEmployeeShort } from "../../../types";

import "./style.scss";

const { Search } = Input;

const EmployeesBlock = ({ socket }: { socket: any }) => {
  const dispatch = useAppDispatch();
  const { employees, loading, settings } = useAppSelector((state) => state);

  const [filterEmployees, setFilterEmployees] = useState<IEmployeeFull[]>([]);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [editedEmployee, setEditedEmployee] = useState<number | null>(null);
  const [userImg, setUserImg] = useState<RcFile>();

  const [form] = Form.useForm<IEmployeeShort>();

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const changeFile: UploadProps["onChange"] = ({ fileList }) =>
    fileList && fileList[0] && setUserImg(fileList[0].originFileObj);

  const sendFormEmployee = async ({
    employee_name,
    userImgName,
    id,
  }: {
    employee_name: string;
    userImgName?: string;
    id?: number | null;
  }) => {
    const bodyReq = editedEmployee ? { employee_name, id } : { employee_name };
    const axiosRes = await axiosClient[editedEmployee ? "put" : "post"](
      `/api/employee/`,
      userImgName
        ? Object.assign(bodyReq, { employee_photo: userImgName })
        : bodyReq
    );
    if (axiosRes.status === 200) {
      message.success(
        editedEmployee
          ? "Информация о сотруднике изменена"
          : "Новый сотрудник добавлен"
      );
      updateLists();
      closeModal();
      form.resetFields();
      socket.emit("update_table", settings);
    } else message.error("Произошла ошибка");
  };

  const onFinish = async ({ employee_name }: IEmployeeShort) => {
    const id = editedEmployee;
    userImg
      ? await sendDataWithFile(
          userImg as RcFile,
          async (userImgName) =>
            await sendFormEmployee({ employee_name, userImgName, id })
        )
      : await sendFormEmployee({ employee_name, id });
  };

  const updateLists = () => {
    dispatch(getEmployees());
    dispatch(getTransactions());
  };

  const deleteEmployee = async (id: number) => {
    const deleted_transaction = await axiosClient.delete(`/api/employee/${id}`);
    if (deleted_transaction.status === 200) {
      updateLists();
      socket.emit("update_table", settings);
    }
  };

  const deleteCooperativeEmployees = async (ids: number[]) => {
    const deleted_cooperative = await axiosClient.post(
      "/api/employee/delete/cooperative/",
      {
        ids,
      }
    );
    if (deleted_cooperative.status === 200) {
      updateLists();
      socket.emit("update_table", settings);
    }
  };

  const openModal = () => setIsOpenModal(true);

  const openEditModal = (employee: IEmployeeShort, id: number) => {
    const fieldsValue = Object.keys(employee).reduce((acc, curr) => {
      const keyofValue = curr as keyof IEmployeeShort;
      if (keyofValue === "employee_photo")
        return {
          ...acc,
          [keyofValue]: [
            {
              status: "done",
              url: `/images/${employee[keyofValue]}`,
            },
          ],
        };
      return { ...acc, [keyofValue]: employee[keyofValue] };
    }, {});
    form.setFieldsValue({ ...fieldsValue });
    setEditedEmployee(id);
    setIsOpenModal(true);
  };

  const closeModal = () => {
    setIsOpenModal(false);
    setEditedEmployee(null);
    form.resetFields();
  };

  const onSearch = (name: string) => {
    const searchEmployees = employees.filter(({ employee_name, employees }) =>
      employee_name
        ? employee_name.includes(name)
        : employees?.some(({ employee_name }) => employee_name.includes(name))
    );
    setFilterEmployees(searchEmployees);
  };

  useEffect(() => {
    dispatch(getEmployees());
  }, []);

  useEffect(() => {
    setFilterEmployees(employees);
  }, [employees]);

  return (
    <>
      <LayoutBlock
        title={"Сотрудники"}
        headerElements={
          <>
            <Search
              placeholder="Найти сотрудника/-ов"
              className="search-employees"
              onSearch={onSearch}
              style={{ width: 250 }}
              allowClear
              enterButton
            />
            <Button type="primary" onClick={openModal}>
              +
            </Button>
          </>
        }
      >
        <List
          className="employees-list"
          loading={loading}
          itemLayout="horizontal"
          grid={{ gutter: 64, column: 3 }}
          dataSource={filterEmployees}
          pagination={{
            total: filterEmployees.length,
            pageSize: 6,
            hideOnSinglePage: true,
          }}
          renderItem={(employee) => {
            const { id, employee_photo, employee_name, employees } = employee;
            const btnActions = [
              <ConfirmPopup
                confirm={() =>
                  employees
                    ? deleteCooperativeEmployees(employees.map((e) => e.id))
                    : deleteEmployee(id)
                }
                title={
                  employees ? "Удалить объединение?" : "Удалить сотрудника?"
                }
              >
                <UserDeleteOutlined style={{ color: "red", fontSize: 20 }} />
              </ConfirmPopup>,
            ];
            return (
              <List.Item
                style={{ display: "flex" }}
                actions={
                  employees
                    ? btnActions
                    : [
                        <EditOutlined
                          onClick={() => openEditModal(employee, id)}
                          style={{ cursor: "pointer", fontSize: 20 }}
                        />,
                        ...btnActions,
                      ]
                }
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      size={100}
                      src={
                        employees ? (
                          <Collage
                            images={employees.map(
                              ({ employee_name, employee_photo, id }) => ({
                                src: `/images/${employee_photo}`,
                                alt: employee_name,
                                key: id,
                              })
                            )}
                          />
                        ) : (
                          `/images/${employee_photo}`
                        )
                      }
                    />
                  }
                  title={
                    employees
                      ? employees.map((e) => e.employee_name).join("/")
                      : employee_name
                  }
                />
              </List.Item>
            );
          }}
        />
      </LayoutBlock>
      <ModalComponent
        open={isOpenModal}
        title={editedEmployee ? "Редактировать сотрудника" : "Новый сотрудник"}
        onCancel={closeModal}
        width={880}
      >
        <Form form={form} name="create-message" onFinish={onFinish}>
          <Form.Item
            name="employee_name"
            label="Сотрудник"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="employee_photo"
            label="Фото"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            extra="Загрузить фото крутого сотрудника"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <UploadPhoto onChange={changeFile} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editedEmployee ? "Изменить" : "Создать"}
            </Button>
          </Form.Item>
        </Form>
      </ModalComponent>
    </>
  );
};

export default EmployeesBlock;
