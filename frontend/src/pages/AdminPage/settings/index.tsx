import { Button, Form, InputNumber, message, Select, Skeleton } from "antd";
import { useContext, useEffect, useState } from "react";
import LayoutBlock from "../../../components/LayoutBlock";
import CurrencyTypeSelect from "../../../components/CurrencyTypeSelect";
import { WebSocketContext } from "../../../components/WebSocket";

import axiosClient from "../../../axiosClient";
import { IPeriodItemsTypes } from "../../../utils/dateMethods/types";
import { currencyTypes } from "../../../consts";
import { periodItems } from "../../../utils/dateMethods/consts";
import { ICurrenciesTypes, ISettings } from "../../../types";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setSettings } from "../../../redux/types/Settings";

const { Option } = Select;

const SettingsBlock = () => {
  const dispatch = useAppDispatch();
  const { settings, loading } = useAppSelector((state) => state);
  const socket = useContext(WebSocketContext);

  const [currencySelect, setCurrencySelect] = useState<string>();

  const [form] = Form.useForm<ISettings>();

  const onFinish = async (values: ISettings) => {
    try {
      const new_settings = await axiosClient.put(`/api/settings/`, {
        ...values,
      });
      if (new_settings.status === 200 && socket) {
        dispatch(setSettings(new_settings.data));
        socket.emit("update_table", {
          ...new_settings.data,
        });
        message.success("Изменения сохранены");
      } else message.error("Произошла ошибка");
    } catch (error) {
      message.error("Произошла ошибка");
    }
  };

  useEffect(() => {
    settings &&
      form.setFieldsValue({
        ...settings,
      });
  }, [settings]);

  if (loading) return <Skeleton active />;

  return (
    <LayoutBlock title={"Настройки"}>
      <Form form={form} name="create-message" onFinish={onFinish}>
        <Form.Item name="time_period" label="Фильтрация">
          <Select>
            {Object.keys(periodItems).map((key) => (
              <Option value={key} key={key}>
                {periodItems[key as IPeriodItemsTypes]}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="currency" label="Основная валюта">
          <Select onSelect={(value: string) => setCurrencySelect(value)}>
            {Object.keys(currencyTypes).map((key) => (
              <Option value={key} key={key}>
                {currencyTypes[key as ICurrenciesTypes]}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="top_level"
          label="Уровень топ"
          rules={[
            {
              type: "number",
              min: 0,
            },
          ]}
        >
          <InputNumber
            style={{ width: "100%" }}
            type="number"
            addonAfter={
              <CurrencyTypeSelect
                value={currencySelect || settings?.currency}
                disabled
              />
            }
          />
        </Form.Item>

        <Form.Item
          name="middle_level"
          label="Уровень средний"
          rules={[
            {
              type: "number",
              min: 0,
            },
          ]}
        >
          <InputNumber
            style={{ width: "100%" }}
            type="number"
            addonAfter={
              <CurrencyTypeSelect
                value={currencySelect || settings?.currency}
                disabled
              />
            }
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Сохранить
          </Button>
        </Form.Item>
      </Form>
    </LayoutBlock>
  );
};

export default SettingsBlock;
