import { NavLink } from "react-router";

function NavBar() {
  return (
    <header className="navbar">
      <nav className="nav-links">
        {}
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/products">Products</NavLink>
        <NavLink to="/cart">Cart</NavLink>
      </nav>
      <div className="nav-actions">
        <NavLink to="/login">Login</NavLink>
      </div>
    </header>
  );
}

export default NavBar;
