import {
  ITransactionFull,
  ITopList,
  ITransactionsAction,
  ITransactionsState,
} from "../../../types";
import {
  SET_TRANSACTIONS,
  SET_TRANSACTIONS_TOP,
} from "../../types/Transactions";

const initialState: ITransactionsState = {
  transactions_full: [],
  transactions_top: {
    top_level: [],
    middle_level: [],
    low_level: [],
    zero_level: []
  },
};

const setTransactionsAction = (
  state: ITransactionsState,
  action: ITransactionsAction
): ITransactionsState => ({
  ...state,
  transactions_full: action.payload as ITransactionFull[],
});

const setTransactionsActionTop = (
  state: ITransactionsState,
  action: ITransactionsAction
): ITransactionsState => ({
  ...state,
  transactions_top: action.payload as ITopList,
});

const TransactionsReducer = (
  state = initialState,
  action: ITransactionsAction
) => {
  switch (action.type) {
    case SET_TRANSACTIONS:
      return setTransactionsAction(state, action);

    case SET_TRANSACTIONS_TOP:
      return setTransactionsActionTop(state, action);

    default:
      return state;
  }
};

export default TransactionsReducer;
