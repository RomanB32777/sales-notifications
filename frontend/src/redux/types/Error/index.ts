export const SET_ERROR = "SET_ERROR";

export const setError = (payload: any) => ({
  type: SET_ERROR,
  payload,
});

export const clearError = () => ({
  type: SET_ERROR,
  payload: {},
});
