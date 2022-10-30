import { IPeriodItemsTypes } from "../utils/dateMethods/types";

type ICurrenciesTypes = "RUB" | "USD" | "AED" | "EUR";

export interface ISettings {
  id?: number;
  time_period: IPeriodItemsTypes;
  currency: ICurrenciesTypes;
  top_level: number;
  middle_level: number;
  duration_congratulation?: number;
}

export interface ISettingsAction {
  type: string;
  payload?: ISettings;
}

export type { ICurrenciesTypes };
