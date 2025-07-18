import { NavLink } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa6";
import { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";

import LoginPopUp from "./authentication/LoginPopUp";
import RecipesDropdownMenu from "./recipesDropdownMenu";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isLoginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (!open) {
      timeout = setTimeout(() => {
        setIsDetailsOpen(false);
      }, 350);
    }

    return () => clearTimeout(timeout);
  }, [open]);

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
      <nav className="hidden sm:flex text-gray-300 h-full">
        <NavLink className="main-nav-link" to="/">
          Overview
        </NavLink>

        <div className="main-nav-link relative justify-center group">
          <NavLink to="/recipes">
            <button type="button" className="flex items-center cursor-pointer">
              Recipes <FaChevronDown size={12} className="ml-2 pt-0.5" />
            </button>
          </NavLink>

          <div className="absolute top-full">
            <RecipesDropdownMenu />
          </div>
        </div>

        <NavLink className="main-nav-link" to="/groceries">
          Groceries
        </NavLink>
      </nav>

      <button
        className="btn-primary hidden sm:block"
        onClick={() => setLoginOpen(true)}
      >
        Log In
      </button>

      <LoginPopUp open={isLoginOpen} onClose={() => setLoginOpen(false)} />

      <button
        onClick={() => setOpen((o) => !o)}
        className="sm:hidden p-2 hover:cursor-pointer"
        aria-label="Open main menu"
      >
        {open ? (
          <FiX size={24} className="text-white" />
        ) : (
          <FiMenu size={24} className="text-white" />
        )}
      </button>

      {/* - Mobile Collapsible Menu Nav */}

      <nav
        className={`absolute inset-x-0 top-[72px]
              mx-2 overflow-hidden rounded-xl border border-slate-700 bg-slate-800
              text-gray-300 transition-[max-height] duration-350 ease-in
              sm:hidden ${
                open ? "max-h-full" : "max-h-0 border-0 duration-350 ease-out"
              }`}
      >
        <ul className="flex flex-col gap-1 px-2 py-3 text-lg">
          <li>
            <NavLink
              onClick={() => setOpen(false)}
              to="/"
              className="block px-4 py-4"
            >
              Overview
            </NavLink>
          </li>

          <li>
            <details
              className="group"
              open={isDetailsOpen}
              onToggle={(e) => setIsDetailsOpen(e.currentTarget.open)}
            >
              <summary
                className="flex w-full items-center justify-between px-4 py-4 rounded-lg 
              hover:cursor-pointer group-open:bg-slate-700"
              >
                Recipes
                <FaChevronDown
                  size={14}
                  className={`transition-transform ${
                    isDetailsOpen ? "rotate-180" : ""
                  }`}
                />
              </summary>

              <RecipesDropdownMenu />
            </details>
          </li>

          <li>
            <NavLink
              onClick={() => setOpen(false)}
              to="/groceries"
              className="block px-4 py-4"
            >
              Groceries
            </NavLink>
          </li>

          <li className="mt-2 px-4 pb-1">
            <button
              className="btn-primary w-full p-2.5"
              onClick={() => setLoginOpen(true)}
            >
              Log In
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
