import { ICurrencies, IFilterSettings } from "./types";

export const currencyTypes: ICurrencies = {
  RUB: "₽",
  USD: "$",
  AED: "AED",
  EUR: "€",
};

export const filter_settings_key = "filter_settings";

export const init_filter_settings: IFilterSettings = {
  time_period: "month",
  currency: "USD",
};
