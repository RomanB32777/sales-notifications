// period-current-time
type IPeriodItemsTypes = "day" | "week" | "month" | "year" | "all";

type IPeriods = {
  [key in IPeriodItemsTypes]: string;
};

export type { IPeriodItemsTypes, IPeriods };
