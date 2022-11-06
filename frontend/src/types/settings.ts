import { IPeriodItemsTypes } from "../utils/dateMethods/types";

type ICurrenciesTypes = "RUB" | "USD" | "AED" | "EUR";

export interface ILevels {
  top_level: number;
  middle_level: number;
}

export interface ISettings extends ILevels {
  id?: number;
  time_period: IPeriodItemsTypes;
  currency: ICurrenciesTypes;
  duration_congratulation?: number;
}

export interface ISettingsAction {
  type: string;
  payload?: ISettings;
}

export type { ICurrenciesTypes };
