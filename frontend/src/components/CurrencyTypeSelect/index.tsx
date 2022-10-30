import { Select } from "antd";
import { ICurrenciesTypes } from "../../types";
import { currencyTypes } from "../../consts";

const CurrencyTypeSelect = ({
  value,
  disabled,
  onChange,
}: {
  value?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
}) => (
  <Select
    value={value}
    options={Object.keys(currencyTypes).map((key) => ({
      value: key,
      label: currencyTypes[key as ICurrenciesTypes],
    }))}
    onChange={onChange}
    size="middle"
    placeholder="Валюта"
    disabled={disabled}
  />
);

export default CurrencyTypeSelect;
