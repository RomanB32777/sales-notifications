import { IUser, IUserAction } from "./user";
import { IMessage, IMessageAction } from "./message";
import {
  ITransaction,
  ITransactionShort,
  ITransactionFull,
  ITransactionTopList,
  ITopList,
  ITransactionsState,
  ITransactionsAction,
} from "./transaction";
import { IEmployee, IEmployeeShort, IEmployeeAction } from "./employee";
import { ICurrenciesTypes, ISettings } from "./settings";

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

export type {
  IFileInfo,
  ICurrenciesTypes,
  ICurrencies,
  IAnyAction,
  ITransaction,
  ITransactionShort,
  ITransactionFull,
  ITransactionTopList,
  ITopList,
  ITransactionsState,
  ITransactionsAction,
  IEmployee,
  IEmployeeShort,
  IEmployeeAction,
  ILoadingAction,
  IMessage,
  IMessageAction,
  IUser,
  IUserAction,
  ISettings,
};
