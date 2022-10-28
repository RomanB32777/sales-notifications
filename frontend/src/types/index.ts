import { time_period_key } from './../utils/dateMethods/consts';
import { IUser, IUserAction } from "./user";
import { IMessage, IMessageAction } from "./message";
import {
  ITransaction,
  ITransactionShort,
  ITransactionFull,
  ITransactionTopList,
  ITransactionsAction,
} from "./transaction";
import { IEmployee, IEmployeeShort, IEmployeeAction } from "./employee";
import { IPeriodItemsTypes } from '../utils/dateMethods/types';

type ICurrenciesTypes = "RUB" | "USD" | "AED" | "EUR"

type ICurrencies = {
  [key in ICurrenciesTypes]: string;
};

interface IFileInfo {
  preview: string;
  file: File | null;
}

interface ILoadingAction {
  type: string;
  payload: boolean;
}

interface IAnyAction {
  type: string;
  payload: any;
}

interface IFilterSettings {
  [time_period_key]: IPeriodItemsTypes,
  currency: ICurrenciesTypes
}

export type {
  IFileInfo,
  ICurrenciesTypes,
  ICurrencies,
  IAnyAction,
  ITransaction,
  ITransactionShort,
  ITransactionFull,
  ITransactionTopList,
  ITransactionsAction,
  IEmployee,
  IEmployeeShort,
  IEmployeeAction,
  ILoadingAction,
  IMessage,
  IMessageAction,
  IUser,
  IUserAction,
  IFilterSettings,
};
