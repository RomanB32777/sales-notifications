import { IEmployee } from "./employee";
import { ITransaction } from "./transaction";

export interface IMessage extends ITransaction {
  employees: IEmployee[];
  active: boolean;
  isNewMessage?: boolean;
}

export interface IMessageAction {
  type: string;
  payload?: IMessage;
}
