import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="flex">
      <img src="" alt="Logo" />
      <div className="flex">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/recipes">Recipes</NavLink>
        <NavLink to="/groceries">Groceries</NavLink>
      </div>
      <button>Log In</button>
    </nav>
  );
};

export default Navbar;
