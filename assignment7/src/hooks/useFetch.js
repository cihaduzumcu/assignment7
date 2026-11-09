import { useEffect, useReducer } from "react";

const initialState = { loading: true, error: null, data: null };

function fetchReducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { loading: true, error: null, data: null };
    case "FETCH_SUCCESS":
      return { loading: false, error: null, data: action.payload };
    case "FETCH_ERROR":
      return { loading: false, error: action.payload, data: null };
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}

export function useFetch(fetchFn, deps) {
  const [state, dispatch] = useReducer(fetchReducer, initialState);

  useEffect(() => {
    const controller = new AbortController();
    dispatch({ type: "FETCH_START" });

    fetchFn(controller.signal)
      .then((data) => dispatch({ type: "FETCH_SUCCESS", payload: data }))
      .catch((error) => {
        // The request was cancelled on purpose: ignore it.
        if (error.name === "AbortError") return;
        dispatch({ type: "FETCH_ERROR", payload: error });
      });

    return () => controller.abort();
  }, deps);

  return state;
}
