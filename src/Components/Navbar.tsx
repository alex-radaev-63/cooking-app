import { NavLink } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa6";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import RecipesMealTypes from "./RecipesMealTypes";

import AllMealsImg from "../assets/images/MealType-All-img.jfif";
import breakfastImg from "../assets/images/MealType-Breakfast-img.jfif";
import lunchImg from "../assets/images/MealType-Lunch-img.jfif";
import dinnerImg from "../assets/images/MealType-Dinner-img.jfif";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const cuisines = [
    "Italian",
    "Chinese",
    "Indian",
    "Mexican",
    "Japanese",
    "French",
    "Thai",
    "American",
    "Spanish",
    "Greek",
    "Russian",
    "Jamaican",
  ];

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

          <div className="absolute top-full pt-2">
            <div role="menu" className="recipe-menu-dropdown">
              <div className="flex flex-col min-w-[160px]">
                <h4 className="font-bold mb-2">Meal&nbsp;Type</h4>
                <RecipesMealTypes ImageURL={AllMealsImg} MealType="All" />
                <RecipesMealTypes
                  ImageURL={breakfastImg}
                  MealType="Breakfast"
                />
                <RecipesMealTypes ImageURL={lunchImg} MealType="Lunch" />
                <RecipesMealTypes ImageURL={dinnerImg} MealType="Dinner" />
              </div>

              <div className="flex flex-col min-w-[300px]">
                <h4 className="font-bold mb-2">Cuisines</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 pt-2">
                  {cuisines.map((cuisine) => (
                    <a
                      href={`/recipes/${cuisine}`}
                      key={cuisine}
                      className="py-1 px-2 rounded-lg hover:bg-slate-700 text-gray-200 hover:text-white transition-all duration-250ms ease-out"
                    >
                      {cuisine}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <NavLink className="main-nav-link" to="/groceries">
          Groceries
        </NavLink>
      </nav>
      <button className="btn-primary hidden sm:block">Log In</button>
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
        <ul className="flex flex-col gap-1 px-4 py-3">
          <li>
            <NavLink
              onClick={() => setOpen(false)}
              to="/"
              className="block py-4"
            >
              Overview
            </NavLink>
          </li>

          <li>
            <details className="group">
              <summary className="flex w-full items-center justify-between py-4 hover:cursor-pointer">
                Recipes
                <FaChevronDown
                  size={14}
                  className="transition-transform group-open:rotate-180"
                />
              </summary>

              <div className="mt-1 space-y-3 pl-4 text-sm">
                <div>
                  <h4 className="font-bold mb-1">Meal Type</h4>
                  <NavLink
                    to="/recipes/breakfast"
                    className="block py-1"
                    onClick={() => setOpen(false)}
                  >
                    Breakfast
                  </NavLink>
                  <NavLink
                    to="/recipes/lunch"
                    className="block py-1"
                    onClick={() => setOpen(false)}
                  >
                    Lunch
                  </NavLink>
                  <NavLink
                    to="/recipes/dinner"
                    className="block py-1"
                    onClick={() => setOpen(false)}
                  >
                    Dinner
                  </NavLink>
                </div>

                <div>
                  <h4 className="font-bold mb-1">Cuisines</h4>
                  <NavLink
                    to="/recipes/italian"
                    className="block py-1"
                    onClick={() => setOpen(false)}
                  >
                    Italian
                  </NavLink>
                  <NavLink
                    to="/recipes/japanese"
                    className="block py-1"
                    onClick={() => setOpen(false)}
                  >
                    Japanese
                  </NavLink>
                  <NavLink
                    to="/recipes/canadian"
                    className="block py-1"
                    onClick={() => setOpen(false)}
                  >
                    Canadian
                  </NavLink>
                </div>
              </div>
            </details>
          </li>

          <li>
            <NavLink
              onClick={() => setOpen(false)}
              to="/groceries"
              className="block py-4"
            >
              Groceries
            </NavLink>
          </li>

          <li className="mt-2">
            <button
              className="btn-primary w-full p-2.5"
              onClick={() => setOpen(false)}
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
