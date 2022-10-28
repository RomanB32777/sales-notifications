import { IPeriodItemsTypes } from "./types";
import moment from "moment";
import { periodItems } from "./consts";

export const DateTimezoneFormatter = (date: string) => {
  const initDate = new Date(date);
  const formatedDate = initDate.getTime();
  const userOffset = initDate.getTimezoneOffset() * 60 * 1000;
  return new Date(formatedDate + userOffset).toISOString();
};

export const DateFormatter = (
  date: string,
  toFormat: string = "DD/MM/YYYY HH:mm"
) => {
  let dateFormat = moment(date).format(toFormat);
  if (dateFormat === "Invalid Date") dateFormat = "";
  return dateFormat;
};

// period-current-time
export const getCurrentTimePeriodQuery: (time_period: string) => string = (
  time_period
) => {
  const findKey = Object.keys(periodItems).find(
    (key) => key === time_period
  );
  return findKey ? periodItems[findKey as IPeriodItemsTypes] : "";
};