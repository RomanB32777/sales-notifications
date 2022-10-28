import {
  DateTimezoneFormatter,
  DateFormatter,
  getCurrentTimePeriodQuery,
} from "./dateMethods";
import { filter_settings_key, init_filter_settings } from "../consts";
import { ICurrenciesTypes, IFilterSettings } from "../types";

const setFilterSettings = (settings: IFilterSettings) =>
  sessionStorage.setItem(filter_settings_key, JSON.stringify(settings));
  
const getFilterSettings = () => {
  const fromStorage = sessionStorage.getItem(filter_settings_key);
  return fromStorage ? JSON.parse(fromStorage) : init_filter_settings;
};

const formatNumber = (value: number, currency: ICurrenciesTypes) => {
  return Intl.NumberFormat("Ru-ru", {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 0,
  }).format(value);
};

export {
  // dates
  DateTimezoneFormatter,
  DateFormatter,
  getCurrentTimePeriodQuery,

  //filter settings
  setFilterSettings,
  getFilterSettings,

  // number
  formatNumber,
};
