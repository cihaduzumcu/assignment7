import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { login } from "../api/authApi.js";
import { useAuth } from "../context/AuthContext.jsx";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user, logIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from;
  const redirectTo = from ? `${from.pathname}${from.search}` : "/";

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const loggedInUser = await login(username, password);
      logIn(loggedInUser);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  }

  if (user) {
    return <p className="status">You are signed in as {user.username}.</p>;
  }

  return (
    <section>
      <h1>Login</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
        {error && <p className="error">{error}</p>}
      </form>
    </section>
  );
}

export default Login;
