import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

import { useAppSelector } from "../../../redux/hooks";

import LayoutBlock from "../../../components/LayoutBlock";
import { WebSocketContext } from "../../../components/WebSocket";
import CurrencyTypeSelect from "../../../components/CurrencyTypeSelect";

import axiosClient from "../../../axiosClient";
import { IEmployeeFull, ITransactionShort } from "../../../types";

interface IFormData extends ITransactionShort {
  employees_id: number[] | string[];
}

const CongratulationFormBlock = () => {
  const { employees, settings, error, loading } = useAppSelector(
    (state) => state
  );
  const navigate = useNavigate();
  const socket = useContext(WebSocketContext);
  const [form] = Form.useForm<IFormData>();
  const [isSelectedCooperative, setIsSelectedCooperative] =
    useState<boolean>(false);

  const onFinish = async (values: IFormData) => {
    try {
      const { employees_id, project_name, transaction_value, currency } =
        values;

      const new_transaction = await axiosClient.post("/api/transaction/", {
        employees_id: values.employees_id.some((e) => typeof e === "string")
          ? (employees_id[0] as string).split("&")
          : employees_id,
        project_name,
        transaction_value,
        currency,
      });
      if (new_transaction.status === 200 && socket) {
        socket.emit("new_message", {
          ...new_transaction.data,
        });
        form.resetFields();
        navigate("/");
      }
    } catch (error) {
      message.error("Произошла ошибка");
    }
  };

  const filterEmployeesList = (employee: IEmployeeFull) =>
    !employee.employees &&
    !form.getFieldValue("employees_id").includes(employee.id);

  const createEmployeesListItem = ({
    id,
    employee_name,
    employees,
  }: IEmployeeFull) => ({
    label: employee_name || employees?.map((ce) => ce.employee_name).join("/"), // ce - cooperative employee
    value: id || employees?.map((ec) => ec.id).join("&"),
  });

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

  if (!socket || loading) {
    return <Skeleton active />;
  }

  return (
    <LayoutBlock title={"Создать поздравление"}>
      <Form form={form} name="create-message" onFinish={onFinish}>
        <Form.List name="employees_id" initialValue={[""]}>
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
            Создать
          </Button>
        </Form.Item>
      </Form>
    </LayoutBlock>
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
