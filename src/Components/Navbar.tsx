import { NavLink } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa6";
import { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";

import LoginPopUp from "./Authentication/LoginPopUp";
import RecipesDropdownMenu from "./RecipesDropdownMenu";
import { useAuth } from "./context/AuthContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [isRecipesOpen, setIsRecipesOpen] = useState(false);
  const [isLoginOpen, setLoginOpen] = useState(false);

  const { user, logOut } = useAuth();

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (!open) {
      timeout = setTimeout(() => {
        setIsRecipesOpen(false);
      }, 350);
    }

    return () => clearTimeout(timeout);
  }, [open]);

  return (
    <header className="flex flex-row justify-between items-center h-[60px] p-2 pl-4 m-2 border-0 rounded-xl border-slate-700 bg-slate-800">
      <NavLink to="/">
        <div className="flex h-8 text-green-300 font-gluten font-medium text-4xl">
          <span className="text-4xl">
            Yum
            <span className="text-3xl">m</span>
            <span className="text-2xl">m</span>
          </span>
        </div>
      </NavLink>

      {/* Desktop Menu */}
      <nav className="hidden sm:flex text-gray-300 h-full">
        <NavLink className="main-nav-link" to="/">
          Groceries
        </NavLink>

        <div className="main-nav-link relative justify-center group">
          <NavLink to="/recipes">
            <button type="button" className="flex items-center cursor-pointer">
              Recipes <FaChevronDown size={12} className="ml-2 pt-0.5" />
            </button>
          </NavLink>

          <div
            className="absolute top-full opacity-0 translate-y-4 group-hover:opacity-100 
            group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto
            transition-all duration-350 ease-in-out z-10"
          >
            <RecipesDropdownMenu />
          </div>
        </div>

        <NavLink className="main-nav-link" to="/overview">
          My Dashboard
        </NavLink>
      </nav>

      {/* Desktop Auth Buttons */}
      {user ? (
        <button className="btn-destructive hidden sm:block" onClick={logOut}>
          Log Out
        </button>
      ) : (
        <button
          className="btn-primary hidden sm:block"
          onClick={() => setLoginOpen(true)}
        >
          Log In
        </button>
      )}

      <LoginPopUp open={isLoginOpen} onClose={() => setLoginOpen(false)} />

      {/* Mobile Menu Toggle */}
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

      {/* Mobile Menu */}
      <nav
        className={`absolute z-999 inset-x-0 top-[72px]
              mx-2 overflow-hidden rounded-xl border border-slate-700 bg-slate-800
              text-gray-300 transition-[max-height] duration-350 ease-in
              sm:hidden ${
                open ? "max-h-screen" : "max-h-0 border-0 duration-350 ease-out"
              }`}
      >
        <ul className="flex flex-col gap-1 px-2 py-3 text-lg">
          <li>
            <NavLink
              onClick={() => setOpen(false)}
              to="/"
              className="block px-4 py-4"
            >
              Groceries
            </NavLink>
          </li>

          <li>
            <button
              onClick={() => setIsRecipesOpen((o) => !o)}
              className={`flex w-full items-center justify-between px-4 py-4 rounded-lg 
                hover:cursor-pointer hover:bg-slate-700 transition-colors ${
                  isRecipesOpen ? "bg-slate-700" : "bg-slate-800"
                }`}
            >
              Recipes
              <FaChevronDown
                size={14}
                className={`transition-transform duration-200 ${
                  isRecipesOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`transition-all duration-350 ease-out overflow-hidden ${
                isRecipesOpen
                  ? "max-h-[1000px] opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <RecipesDropdownMenu />
            </div>
          </li>

          <li>
            <NavLink
              onClick={() => setOpen(false)}
              to="/overview"
              className="block px-4 py-4"
            >
              My Dashboard
            </NavLink>
          </li>

          <li className="mt-2 px-4 pb-1">
            {user ? (
              <button
                className="btn-destructive bg-slate-700/50 hover:bg-red-500/25 w-full p-2.5"
                onClick={() => {
                  logOut();
                  setOpen(false);
                }}
              >
                Log Out
              </button>
            ) : (
              <button
                className="btn-primary w-full p-2.5"
                onClick={() => {
                  setLoginOpen(true);
                  setOpen(false);
                }}
              >
                Log In
              </button>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
