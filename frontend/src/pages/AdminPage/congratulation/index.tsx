import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  AutoComplete,
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Select,
  Skeleton,
  Upload,
} from "antd";
import type { RcFile, UploadProps, UploadFile } from "antd/es/upload/interface";

import { useAppSelector } from "../../../redux/hooks";
import axiosClient from "../../../axiosClient";

import LayoutBlock from "../../../components/LayoutBlock";
import { WebSocketContext } from "../../../components/WebSocket";
import {
  ICurrenciesTypes,
  IFilterSettings,
  ITransactionShort,
} from "../../../types";
import { currencyTypes } from "../../../consts";
import { getFilterSettings } from "../../../utils";

const CurrencyTypeSelect = (
  <Select
    options={Object.keys(currencyTypes).map((key) => ({
      value: key,
      label: currencyTypes[key as ICurrenciesTypes],
    }))}
    size="middle"
    placeholder="Валюта"
  />
);

interface IAutoCompleteOption {
  value: string;
  key: number;
}

interface IFormData extends ITransactionShort {
  employee_name: string;
}

const CongratulationFormBlock = () => {
  const { employees, error, loading } = useAppSelector((state) => state);
  const socket = useContext(WebSocketContext);
  const uploadInputRef = useRef(null);
  const [userImg, setUserImg] = useState<RcFile>();
  const [employeeSelected, setEmployeeSelected] =
    useState<IAutoCompleteOption | null>(null);
  const navigate = useNavigate();

  const [form] = Form.useForm<IFormData>();

  const changeFile: UploadProps["onChange"] = ({ fileList }) =>
    fileList && fileList[0] && setUserImg(fileList[0].originFileObj);

  const sendDataWithFile = async (cb: (fileName: string) => Promise<void>) => {
    try {
      const formData = new FormData();
      formData.append("file", userImg as RcFile);

      const { data } = await axiosClient.post(`/api/file/`, formData, {
        headers: {
          "Content-type": "multipart/form-data",
        },
      });
      cb && data.filename && (await cb(data.filename));
    } catch (error) {
      (error as Error).message && message.error((error as Error).message);
    }
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as RcFile);
        reader.onload = () => resolve((reader.result as string) || "");
      });
    }
    if (src) {
      const image = new Image();
      image.src = src;
      const imgWindow = window.open(src);
      (imgWindow as Window).document.write(image.outerHTML);
    }
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const createTransaction = async (values: ITransactionShort) => {
    const { employee_id, project_name, transaction_value, currency } = values;
    const new_transaction = await axiosClient.post(`/api/transaction/`, {
      employee_id,
      project_name,
      transaction_value,
      currency,
    });
    console.log(new_transaction.data);
    if (new_transaction.status === 200 && socket) {
      socket.emit("new_message", {
        ...new_transaction.data,
      });
      navigate("/");
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
          : await sendDataWithFile(async (userImgName) => {
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
    const { currency }: IFilterSettings = getFilterSettings();
    form.setFieldsValue({
      currency: currency
    });
  }, []);

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
                {CurrencyTypeSelect}
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
            <Upload
              beforeUpload={() => false}
              listType="picture-card"
              maxCount={1}
              ref={uploadInputRef}
              onPreview={onPreview}
              accept=".jpg, .jpeg, .png"
              onChange={changeFile}
            >
              Выбрать фото
            </Upload>
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
