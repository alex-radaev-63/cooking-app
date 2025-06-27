import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center h-[60px] p-2 pl-4 m-2 border-0 rounded-xl border-slate-700 bg-slate-800">
      <div className="flex align-middle h-8">
        <span className=" text-green-300 text-4xl font-gluten font-medium">
          Yum
        </span>
      </div>

      <div className="flex text-gray-300 h-full">
        <div className="main-nav-link">
          <NavLink to="/">Home</NavLink>
        </div>
        <div className="main-nav-link">
          <NavLink to="/recipes">Recipes</NavLink>
        </div>
        <div className="main-nav-link">
          <NavLink to="/groceries">Groceries</NavLink>
        </div>
      </div>

      <div className="flex align-middle h-full">
        <button className="btn-primary">Log In</button>
      </div>
    </nav>
  );
};

export default Navbar;
