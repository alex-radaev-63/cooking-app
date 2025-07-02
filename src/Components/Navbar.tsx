import { NavLink } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa6";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center h-[60px] p-2 pl-4 m-2 border-0 rounded-xl border-slate-700 bg-slate-800">
      <div className="flex align-middle h-8 text-green-300 font-gluten font-medium">
        <span className="text-4xl">
          Yum
          <span className="text-3xl">m</span>
          <span className="text-2xl">m</span>
        </span>
      </div>

      <div className="flex text-gray-300 h-full">
        <div className="main-nav-link">
          <NavLink to="/">Overview</NavLink>
        </div>
        <div className="main-nav-link relative justify-center group">
          <button
            type="button"
            className="flex items-center justify-center hover:cursor-pointer"
          >
            Recipes <FaChevronDown size={12} className="pt-0.5 ml-2" />
          </button>
          <div className="absolute top-full pt-2">
            <div role="menu" className="recipe-menu-dropdown">
              <div className="flex-col p-3">Meal&nbsp;Type</div>
              <div className="flex-col p-3">Cuisines</div>
            </div>
          </div>
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
