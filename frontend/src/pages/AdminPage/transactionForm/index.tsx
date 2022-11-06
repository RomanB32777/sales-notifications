import { useEffect, useMemo, useState } from "react";
import { Button, Form, Input, InputNumber, message, Select } from "antd";
import { UserDeleteOutlined, PlusOutlined } from "@ant-design/icons";

import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import CurrencyTypeSelect from "../../../components/CurrencyTypeSelect";

import axiosClient from "../../../axiosClient";
import { getTransactions } from "../../../redux/types/Transactions";
import { getEmployees } from "../../../redux/types/Employees";
import { IEmployeeFull, ITransactionShort } from "../../../types";
import { validateMessages } from "../../../consts";

export interface IFormTransactionData extends ITransactionShort {
  employees: number[] | string[];
  id?: number;
}

const CongratulationFormBlock = ({
  socket,
  transaction,
  layout,
  successMethod,
}: {
  socket: any;
  transaction?: IFormTransactionData | null;
  layout?: {};
  successMethod?: () => any;
}) => {
  const dispatch = useAppDispatch();
  const { employees, settings, loading } = useAppSelector((state) => state);
  const [form] = Form.useForm<IFormTransactionData>();
  const [isSelectedCooperative, setIsSelectedCooperative] =
    useState<boolean>(false);

  const onFinish = async (values: IFormTransactionData) => {
    try {
      const { employees, project_name, transaction_value, currency } = values;

      const sendBody = {
        employees: values.employees.some((e) => typeof e === "string")
          ? (employees[0] as string).split("&")
          : employees,
        project_name,
        transaction_value,
        currency,
      };

      const transaction_res = await axiosClient[isEdit ? "put" : "post"](
        "/api/transaction/",
        isEdit && transaction ? { ...sendBody, id: transaction.id } : sendBody
      );
      if (transaction_res.status === 200) {
        dispatch(getTransactions());
        dispatch(getEmployees());
        form.resetFields();
        form.setFieldsValue({
          currency: settings?.currency,
        });
        !isEdit &&
          socket.emit("new_message", {
            ...transaction_res.data,
          });
        successMethod && successMethod();
      }
    } catch (error) {
      message.error("Произошла ошибка");
    }
  };

  const filterEmployeesList = ({ employees, id }: IEmployeeFull) =>
    !employees && !form.getFieldValue("employees").includes(id);

  const createEmployeesListItem = ({
    id,
    employee_name,
    employees,
  }: IEmployeeFull) => ({
    label: employee_name || employees?.map((ce) => ce.employee_name).join("/"), // ce - cooperative employee
    value: id || employees?.map((ec) => ec.id).join("&"),
  });

  const isEdit = useMemo(() => Boolean(transaction), [transaction]);

  useEffect(() => {
    if (transaction) {
      const editedEmployees = employees.filter(({ id }) =>
        transaction.employees.includes(id as never)
      );
      form.setFieldsValue({
        ...transaction,
        employees: editedEmployees.map((e) => createEmployeesListItem(e)),
      });
    }
  }, [transaction]);

  useEffect(() => {
    form.setFieldsValue({
      currency: settings?.currency,
    });
  }, [settings]);

  return (
    <Form
      {...layout}
      labelAlign="left"
      form={form}
      name="create-message"
      onFinish={onFinish}
      validateMessages={validateMessages}
      disabled={loading}
    >
      <Form.List name="employees" initialValue={[""]}>
        {(fields, { add, remove }) => (
          <>
            {fields.map((field, index) => (
              <Form.Item
                label={`Сотрудник ${fields.length > 1 ? index + 1 : ""}`}
                required={true}
                key={field.key}
                extra={`${
                  index === fields.length - 1 && fields.length === 4
                    ? "Максимальное количество сотрудников - 4"
                    : ""
                }`}
              >
                <Form.Item
                  {...field}
                  label={`Сотрудник ${fields.length > 1 ? index + 1 : ""}`}
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  noStyle
                >
                  <Select
                    showSearch
                    options={employees
                      .filter((e) =>
                        fields.length > 1 ? filterEmployeesList(e) : true
                      )
                      .map((e) => createEmployeesListItem(e))}
                    onSelect={(selected: number | string) =>
                      Number(selected)
                        ? setIsSelectedCooperative(false)
                        : setIsSelectedCooperative(true)
                    }
                    filterOption={(input, option) =>
                      option?.label
                        ? option.label
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0 ||
                          option.label
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        : false
                    }
                    style={{ width: isEdit ? "100%" : "90%" }}
                    disabled={isEdit}
                  />
                </Form.Item>

                {fields.length > 1 && !isEdit ? (
                  <UserDeleteOutlined
                    style={{ color: "red" }}
                    onClick={() => remove(field.name)}
                    className="dynamic-button"
                  />
                ) : null}
                {fields.length < 4 &&
                  index + 1 === fields.length &&
                  !isSelectedCooperative &&
                  !isEdit && (
                    <PlusOutlined
                      className="dynamic-button"
                      onClick={() => add()}
                    />
                  )}
              </Form.Item>
            ))}
          </>
        )}
      </Form.List>
      <Form.Item
        name="project_name"
        label="Проект"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="transaction_value"
        label="Стоимость"
        rules={[
          {
            required: true,
            type: "number",
            min: 0,
          },
        ]}
      >
        <InputNumber
          style={{ width: "100%" }}
          type="number"
          addonAfter={
            <Form.Item name="currency" noStyle>
              <CurrencyTypeSelect />
            </Form.Item>
          }
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {isEdit ? "Изменить" : "Создать"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CongratulationFormBlock;

// <AutoComplete
//   options={employees.map((e) => ({
//     value: e.employee_name,
//     key: e.id,
//   }))}
//   filterOption={(inputValue, option) =>
//     option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
//   }
//   onSelect={(value: string, option: IAutoCompleteOption) =>
//     setEmployeeSelected(option)
//   }
//   onBlur={autoCompleteBlur}
//   style={{ width: "90%" }}
// />;
