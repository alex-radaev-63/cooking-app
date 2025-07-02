import { NavLink } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa6";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="flex justify-between items-center h-[60px] p-2 pl-4 m-2 border-0 rounded-xl border-slate-700 bg-slate-800">
      <NavLink to="/">
        <div className="flex h-8 text-green-300 font-gluten font-medium text-4xl">
          <span className="text-4xl">
            Yum
            <span className="text-3xl">m</span>
            <span className="text-2xl">m</span>
          </span>
        </div>
      </NavLink>

      <nav className="hidden md:flex text-gray-300 h-full">
        <NavLink className="main-nav-link" to="/">
          Overview
        </NavLink>

        <div className="main-nav-link relative justify-center group">
          <button type="button" className="flex items-center">
            Recipes <FaChevronDown size={12} className="ml-2 pt-0.5" />
          </button>
          <div className="absolute top-full pt-2">
            <div role="menu" className="recipe-menu-dropdown">
              <div className="flex-col p-3">
                <h4 className="font-bold mb-2">Meal&nbsp;Type</h4>
                <p>Breakfast</p>
                <p>Lunch</p>
                <p>Dinner</p>
              </div>
              <div className="flex-col p-3">
                <h4 className="font-bold mb-2">Cuisines</h4>
                <p>Italian</p>
                <p>Japanese</p>
                <p>Canadian</p>
              </div>
            </div>
          </div>
        </div>

        <NavLink className="main-nav-link" to="/groceries">
          Groceries
        </NavLink>
      </nav>

      <button className="btn-primary hidden md:block">Log In</button>

      <button
        onClick={() => setOpen((o) => !o)}
        className="md:hidden p-2"
        aria-label="Open main menu"
      >
        {open ? (
          <FiX size={24} className="text-white" />
        ) : (
          <FiMenu size={24} className="text-white" />
        )}
      </button>
    </header>
  );
};

export default Navbar;
