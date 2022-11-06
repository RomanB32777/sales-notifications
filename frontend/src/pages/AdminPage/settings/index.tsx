import { Button, Form, InputNumber, message, Select } from "antd";
import { useEffect, useState } from "react";
import LayoutBlock from "../../../components/LayoutBlock";
import CurrencyTypeSelect from "../../../components/CurrencyTypeSelect";

import axiosClient from "../../../axiosClient";
import { IPeriodItemsTypes } from "../../../utils/dateMethods/types";
import { currencyTypes, validateMessages } from "../../../consts";
import { periodItems } from "../../../utils/dateMethods/consts";
import { ICurrenciesTypes, ILevels, ISettings } from "../../../types";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setSettings } from "../../../redux/types/Settings";

const { Option } = Select;

const layout = {
  wrapperCol: { span: 21 },
  labelCol: { span: 3 },
  labelWrap: true,
};

const SettingsBlock = ({ socket }: { socket: any }) => {
  const dispatch = useAppDispatch();
  const { settings, loading } = useAppSelector((state) => state);

  const [currencySelect, setCurrencySelect] = useState<string>();
  const [levelsValues, setLevelsValues] = useState<ILevels>({
    top_level: 0,
    middle_level: 0,
  });

  const [form] = Form.useForm<ISettings>();

  const onValuesChange = (changedValues: {
    [fieldName in keyof ISettings]: any;
  }) => {
    changedValues.middle_level &&
      setLevelsValues({
        ...levelsValues,
        middle_level: changedValues.middle_level,
      });

    changedValues.top_level &&
      setLevelsValues({
        ...levelsValues,
        top_level: changedValues.top_level,
      });
  };

  const onFinish = async (values: ISettings) => {
    try {
      const new_settings = await axiosClient.put(`/api/settings/`, {
        ...values,
      });
      if (new_settings.status === 200) {
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
    if (settings) {
      form.setFieldsValue({
        ...settings,
      });
      setLevelsValues({
        top_level: settings.top_level,
        middle_level: settings.middle_level,
      });
    }
  }, [settings]);

  return (
    <LayoutBlock title={"Настройки"}>
      <Form
        {...layout}
        labelAlign="left"
        form={form}
        name="settings-form"
        onFinish={onFinish}
        disabled={loading}
        validateMessages={validateMessages}
        onValuesChange={onValuesChange}
      >
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
              min: levelsValues.middle_level,
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
              max: levelsValues.top_level,
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
