import allMealsImg from "../assets/images/MealType-All-img.jfif";
import breakfastImg from "../assets/images/MealType-Breakfast-img.jfif";
import lunchImg from "../assets/images/MealType-Lunch-img.jfif";
import dinnerImg from "../assets/images/MealType-Dinner-img.jfif";

import RecipesMealTypes from "./RecipesMealTypes";

const RecipesDropdownMenu = () => {
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
    <div role="menu" className="recipe-menu-dropdown mt-3 pl-4">
      <div className="flex flex-col min-w-[160px]">
        <h4 className="font-bold mb-3 text-sm">Meal&nbsp;Types</h4>
        <div className="grid grid-cols-2 gap-2 sm:gap-1 sm:flex sm:flex-col">
          <RecipesMealTypes ImageURL={allMealsImg} MealType="All" />
          <RecipesMealTypes ImageURL={breakfastImg} MealType="Breakfast" />
          <RecipesMealTypes ImageURL={lunchImg} MealType="Lunch" />
          <RecipesMealTypes ImageURL={dinnerImg} MealType="Dinner" />
        </div>
      </div>

      <div className="flex flex-col min-w-[300px]">
        <h4 className="font-bold text-sm mb-1 sm:mb-2">Cuisines</h4>
        <div className="grid grid-cols-2 gap-x-4 sm:gap-y-2 pt-2">
          {cuisines.map((cuisine) => (
            <a
              href={`/recipes`}
              key={cuisine}
              className="py-1 px-2 rounded-lg hover:bg-slate-700 text-gray-400
                       hover:text-white transition-all duration-250ms ease-out"
            >
              {cuisine}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecipesDropdownMenu;
