import { ICurrencies, ISettings } from "./types";

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
