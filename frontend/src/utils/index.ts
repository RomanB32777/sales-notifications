import type { RcFile } from "antd/es/upload/interface";
import {
  DateTimezoneFormatter,
  DateFormatter,
  getCurrentTimePeriodQuery,
} from "./dateMethods";
import { ICurrenciesTypes } from "../types";
import { message } from "antd";
import axiosClient from "../axiosClient";

const formatNumber = (value: number, currency: ICurrenciesTypes) => {
  return Intl.NumberFormat("Ru-ru", {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 0,
  }).format(value);
};

const sendDataWithFile = async (
  img: RcFile,
  cb: (fileName: string) => Promise<void>
) => {
  try {
    const formData = new FormData();
    formData.append("file", img);

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

export {
  // dates
  DateTimezoneFormatter,
  DateFormatter,
  getCurrentTimePeriodQuery,

  // number
  formatNumber,

  // files
  sendDataWithFile,
};
