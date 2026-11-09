import { NavLink } from "react-router";
import { selectItemCount, useCartStore } from "../store/cartStore.js";

function NavBar() {
  const itemCount = useCartStore(selectItemCount);

  return (
    <header className="navbar">
      <nav className="nav-links">
        {}
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/products">Products</NavLink>
        <NavLink to="/cart">Cart ({itemCount})</NavLink>
      </nav>
      <div className="nav-actions">
        <NavLink to="/login">Login</NavLink>
      </div>
    </header>
  );
}

export default NavBar;
