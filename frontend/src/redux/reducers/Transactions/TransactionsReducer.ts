import { ITransactionFull, ITransactionsAction, ITransactionTopList } from "../../../types";
import { SET_TRANSACTIONS } from "../../types/Transactions";

const initialState: ITransactionFull[] | ITransactionTopList[] = [];

const TransactionsReducer = (
  state = initialState,
  action: ITransactionsAction
) => {
  switch (action.type) {
    case SET_TRANSACTIONS:
      return action.payload;

    default:
      return state;
  }
};

export default TransactionsReducer;
