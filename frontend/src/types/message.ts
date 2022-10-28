import { ITransactionFull } from './transaction';
import { IEmployeeShort } from './employee';

export interface IMessage extends ITransactionFull, IEmployeeShort {
  active: boolean;
  isNewMessage?: boolean
}

export interface IMessageAction {
  type: string;
  payload?: IMessage;
}