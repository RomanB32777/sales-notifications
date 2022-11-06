import { ICurrencies, ISettings, ITransactionFilterFieldsKeys } from "./types";

export const currencyTypes: ICurrencies = {
  RUB: "₽",
  USD: "$",
  AED: "AED",
  EUR: "€",
};

export const filter_settings_key = "filter_settings";

export const init_filter_settings: ISettings = {
  time_period: "month",
  currency: "AED",
  top_level: 100,
  middle_level: 10,
};

export const contactDeveloperStr = (
  <>
    Попробуйте перезагрузить сайт или обратитесь к{" "}
    <a href="https://t.me/RomanNeptun" target="_blank" rel="noreferrer">
      разработчику
    </a>
  </>
);

export const filterTransactionFields: {
  value: ITransactionFilterFieldsKeys;
  label: string;
}[] = [
  {
    value: "project_name",
    label: "Название проекта",
  },
  {
    value: "employees",
    label: "Имя брокера",
  },
  {
    value: "transaction_value",
    label: "Сумма сделки",
  },
  {
    value: "currency",
    label: "Валюта",
  },
];

export const inclinedFilterTransactionFields: {
  [field in ITransactionFilterFieldsKeys]: string;
} = {
  project_name: "названию проекта",
  employees: "имени брокера",
  transaction_value: "по сумме сделки",
  currency: "по валюте",
};

/* eslint-disable no-template-curly-in-string */
export const validateMessages = {
  required: "Поле ${label} обязательно к заполнению!",
  types: {
    email: "${label} - не валидный email!",
    number: "${label} - не валидное число!",
  },
  number: {
    min: "${label} - Значение не может быть меньше ${min}",
    range: "${label} - Значение должны быть между ${min} и ${max}",
  },
};
/* eslint-enable no-template-curly-in-string */
