import { Outlet } from "react-router";
import NavBar from "./NavBar.jsx";
import { useLocalStorage } from "../hooks/useLocalStorage.js";

function Layout() {
  const [theme, setTheme] = useLocalStorage("theme", "light");

  const toggleTheme = () =>
    setTheme((current) => (current === "light" ? "dark" : "light"));

  return (
    <div className={`app theme-${theme}`}>
      <NavBar theme={theme} onToggleTheme={toggleTheme} />
      <main className="content">
        {}
        <Outlet />
      </main>
      <footer className="footer">Assignment 7 · Online Shop</footer>
    </div>
  );
}

export default Layout;
