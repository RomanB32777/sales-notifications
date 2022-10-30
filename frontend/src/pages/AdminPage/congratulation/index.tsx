import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  AutoComplete,
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Skeleton,
} from "antd";
import type { RcFile, UploadProps } from "antd/es/upload/interface";

import { useAppSelector } from "../../../redux/hooks";

import LayoutBlock from "../../../components/LayoutBlock";
import { WebSocketContext } from "../../../components/WebSocket";
import CurrencyTypeSelect from "../../../components/CurrencyTypeSelect";
import UploadPhoto from "../../../components/UploadPhoto";

import axiosClient from "../../../axiosClient";
import { sendDataWithFile } from "../../../utils";
import { ITransactionShort } from "../../../types";

interface IAutoCompleteOption {
  value: string;
  key: number;
}

interface IFormData extends ITransactionShort {
  employee_name: string;
}

const CongratulationFormBlock = () => {
  const { employees, settings, error, loading } = useAppSelector(
    (state) => state
  );
  const socket = useContext(WebSocketContext);
  const [userImg, setUserImg] = useState<RcFile>();
  const [employeeSelected, setEmployeeSelected] =
    useState<IAutoCompleteOption | null>(null);
  const navigate = useNavigate();

  const [form] = Form.useForm<IFormData>();

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const changeFile: UploadProps["onChange"] = ({ fileList }) =>
    fileList && fileList[0] && setUserImg(fileList[0].originFileObj);

  const createTransaction = async (values: ITransactionShort) => {
    const { employee_id, project_name, transaction_value, currency } = values;
    const new_transaction = await axiosClient.post(`/api/transaction/`, {
      employee_id,
      project_name,
      transaction_value,
      currency,
    });
    if (new_transaction.status === 200 && socket) {
      socket.emit("new_message", {
        ...new_transaction.data,
      });
      navigate("/congratulation");
    }
  };

  const onFinish = async (values: IFormData) => {
    if (socket) {
      try {
        employeeSelected
          ? await createTransaction({
              ...values,
              employee_id: employeeSelected.key,
            })
          : await sendDataWithFile(userImg as RcFile, async (userImgName) => {
              const new_employee = await axiosClient.post(`/api/employee/`, {
                employee_name: values.employee_name,
                employee_photo: userImgName,
              });
              if (new_employee.status === 200) {
                await createTransaction({
                  ...values,
                  employee_id: new_employee.data.id,
                });
              }
            });
      } catch (error) {
        message.error("Произошла ошибка");
      }
    }
  };

  const autoCompleteBlur = () => {
    const employee_name = form.getFieldValue("employee_name");
    !employees.some((e) => e.employee_name === employee_name) &&
      setEmployeeSelected(null);
  };

  useEffect(() => {
    form.setFieldsValue({
      currency: settings?.currency,
    });
  }, [settings]);

  if (!!Object.keys(error).length && socket && !socket.connected)
    return (
      <Alert
        message={error.message}
        description={error.description}
        type="error"
      />
    );

  if (!socket || loading) {
    return <Skeleton active />;
  }

  return (
    <LayoutBlock title={"Создать поздравление"}>
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
          <AutoComplete
            options={employees.map((e) => ({
              value: e.employee_name,
              key: e.id,
            }))}
            filterOption={(inputValue, option) =>
              option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !==
              -1
            }
            onSelect={(value: string, option: IAutoCompleteOption) =>
              setEmployeeSelected(option)
            }
            onBlur={autoCompleteBlur}
          />
        </Form.Item>
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
        {!employeeSelected && (
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
        )}
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
