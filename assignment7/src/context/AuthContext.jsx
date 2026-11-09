import { createContext, useContext, useMemo, useReducer } from "react";

const AuthContext = createContext(null);

const initialState = { user: null };

function authReducer(state, action) {
  switch (action.type) {
    case "LOGGED_IN":
      return { user: action.payload };
    case "LOGGED_OUT":
      return { user: null };
    default:
      throw new Error(`Unknown auth action: ${action.type}`);
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const value = useMemo(
    () => ({
      user: state.user,
      logIn: (user) => dispatch({ type: "LOGGED_IN", payload: user }),
      logOut: () => dispatch({ type: "LOGGED_OUT" }),
    }),
    [state.user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used inside an <AuthProvider>. Wrap your app with <AuthProvider>.");
  }
  return context;
}