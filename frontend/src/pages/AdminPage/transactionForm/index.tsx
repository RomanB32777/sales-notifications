import { useContext, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Select,
  Skeleton,
} from "antd";
import { UserDeleteOutlined, PlusOutlined } from "@ant-design/icons";

import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { WebSocketContext } from "../../../components/WebSocket";
import CurrencyTypeSelect from "../../../components/CurrencyTypeSelect";

import axiosClient from "../../../axiosClient";
import { getTransactions } from "../../../redux/types/Transactions";
import { getEmployees } from "../../../redux/types/Employees";
import { IEmployeeFull, ITransactionShort } from "../../../types";

export interface IFormTransactionData extends ITransactionShort {
  employees: number[] | string[];
}

const CongratulationFormBlock = ({
  transaction,
}: {
  transaction?: IFormTransactionData | null;
}) => {
  const dispatch = useAppDispatch();
  const { employees, settings, error } = useAppSelector(
    (state) => state
  );
  const socket = useContext(WebSocketContext);
  const [form] = Form.useForm<IFormTransactionData>();
  const [isSelectedCooperative, setIsSelectedCooperative] =
    useState<boolean>(false);

  const onFinish = async (values: IFormTransactionData) => {
    try {
      const { employees, project_name, transaction_value, currency } = values;

      const new_transaction = await axiosClient[isEdit ? "put" : "post"](
        "/api/transaction/",
        {
          employees: values.employees.some((e) => typeof e === "string")
            ? (employees[0] as string).split("&")
            : employees,
          project_name,
          transaction_value,
          currency,
        }
      );
      if (new_transaction.status === 200 && socket) {
        dispatch(getTransactions());
        dispatch(getEmployees());
        socket.emit("new_message", {
          ...new_transaction.data,
        });
        form.resetFields();
        form.setFieldsValue({
          currency: settings?.currency,
        });
      }
    } catch (error) {
      message.error("Произошла ошибка");
    }
  };

  const filterEmployeesList = (employee: IEmployeeFull) =>
    !employee.employees &&
    !form.getFieldValue("employees").includes(employee.id);

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
    form.setFieldsValue({ ...transaction });
  }, [transaction]);

  useEffect(() => {
    form.setFieldsValue({
      currency: settings?.currency,
    });
  }, [settings]);

  if (!!Object.keys(error).length && socket && !socket.connected)
    return (
      <Alert
        message={"error.message"}
        description={error.description}
        type="error"
        style={{ margin: " 24px 0" }}
      />
    );

  // if (!socket || loading) {
  //   return <Skeleton active />;
  // }

  return (
    <Form form={form} name="create-message" onFinish={onFinish}>
      <Form.List name="employees" initialValue={[""]}>
        {(fields, { add, remove }) => (
          <>
            {fields.map((field, index) => (
              <Form.Item
                label={`Сотрудник ${fields.length > 1 ? index + 1 : ""}`}
                required={true}
                key={field.key}
              >
                <Form.Item
                  {...field}
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
                    style={{ width: "90%" }}
                  />
                </Form.Item>

                {fields.length > 1 ? (
                  <UserDeleteOutlined
                    style={{ color: "red" }}
                    onClick={() => remove(field.name)}
                    className="dynamic-button"
                  />
                ) : null}
                {index + 1 === fields.length && !isSelectedCooperative && (
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
