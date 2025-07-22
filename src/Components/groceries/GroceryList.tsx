import { useState } from "react";
import { FaPencil } from "react-icons/fa6";
import { LuCookingPot } from "react-icons/lu";
import { TbMeat } from "react-icons/tb";

import GroceryItem from "./GroceryItem";
import type { GroceryItem as GroceryItemType } from "../../data/groceryData";

interface Props {
  date: string;
  items: GroceryItemType[];
  recipes: string[];
  index: number;
}

const GroceryList = ({ date, items, recipes, index }: Props) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl border border-slate-700 bg-slate-800 px-6 py-5 text-white">
        {/* Top row */}

        <div className="flex flex-row min-h-[40px] justify-between items-center">
          <h3 className="text-xl font-medium">{date}</h3>
          {!isEditing && (
            <button
              onClick={() => {
                setIsEditing(!isEditing);
              }}
              className="flex py-2 px-4 items-center rounded-lg hover:bg-slate-700 hover:cursor-pointer"
            >
              <FaPencil size="12px" className="mr-2" />
              Edit
            </button>
          )}
        </div>

        {/* Grocery items */}

        <div className="flex flex-col mt-4 mb-6 gap-3">
          <div className="flex flex-row gap-2 items-center">
            <TbMeat size={16} className="text-gray-400 mt-0.5" />
            <h4 className="text-gray-400">Item's list</h4>
          </div>
          <ul className="flex flex-col">
            {items.map((item) => (
              <GroceryItem key={item.id} item={item} listIndex={index} />
            ))}
          </ul>
        </div>

        {/* Recipes & Save Edits button */}

        <div className="flex flex-row justify-between items-end">
          <div className="flex flex-col gap-3">
            <div className="flex flex-row gap-2 items-center">
              <LuCookingPot size={14} className="text-gray-400" />
              <h4 className="text-gray-400">Recipes</h4>
            </div>
            <ul>
              {recipes.map((recipe, recipeId) => (
                <li key={recipeId}>{recipe}</li>
              ))}
            </ul>
          </div>

          {isEditing && (
            <button
              onClick={() => {
                setIsEditing(!isEditing);
              }}
              className="btn-primary"
            >
              Save Edits
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroceryList;
