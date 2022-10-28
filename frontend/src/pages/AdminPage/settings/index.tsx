import { Button, Form, message, Select } from "antd";
import { useEffect } from "react";
import LayoutBlock from "../../../components/LayoutBlock";
import { getFilterSettings, setFilterSettings } from "../../../utils";
import { IPeriodItemsTypes } from "../../../utils/dateMethods/types";
import { currencyTypes } from "../../../consts";
import {
  periodItems,
  time_period_key,
} from "../../../utils/dateMethods/consts";
import { ICurrenciesTypes, IFilterSettings } from "../../../types";

const { Option } = Select;

const SettingsBlock = () => {
  const [form] = Form.useForm<IFilterSettings>();

  const onFinish = async (values: IFilterSettings) => {
    try {
      setFilterSettings(values);
      message.success("Изменения сохранены");
    } catch (error) {
      message.error("Произошла ошибка");
    }
  };

  useEffect(() => {
    const settings: IFilterSettings = getFilterSettings();
    form.setFieldsValue({
      time_period: (settings?.time_period as IPeriodItemsTypes) || "month",
      currency: (settings?.currency as ICurrenciesTypes) || "RUB",
    });
  }, []);

  return (
    <LayoutBlock title={"Настройки"}>
      <Form form={form} name="create-message" onFinish={onFinish}>
        <Form.Item name={time_period_key} label="Фильтрация">
          <Select>
            {Object.keys(periodItems).map((key) => (
              <Option value={key} key={key}>
                {periodItems[key as IPeriodItemsTypes]}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="currency" label="Основная валюта">
          <Select disabled>
            {Object.keys(currencyTypes).map((key) => (
              <Option value={key} key={key}>
                {currencyTypes[key as ICurrenciesTypes]}
              </Option>
            ))}
            {/* */}
          </Select>
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
