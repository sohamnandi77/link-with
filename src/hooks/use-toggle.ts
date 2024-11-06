import { useCallback, useReducer } from "react";

type Action = { type: "TOGGLE" } | { type: "SET"; payload: boolean };

const reducer = (state: boolean, action: Action) => {
  switch (action.type) {
    case "TOGGLE":
      return !state;
    case "SET":
      return action.payload;
    default:
      return state;
  }
};

const useToggle = (initialState = false) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const toggle = useCallback(() => dispatch({ type: "TOGGLE" }), []);
  const setValue = useCallback(
    (value: boolean) => dispatch({ type: "SET", payload: value }),
    [],
  );

  return [state, toggle, setValue] as const;
};

export default useToggle;
