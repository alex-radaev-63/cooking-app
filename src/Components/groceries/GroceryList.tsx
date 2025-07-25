import { FaPencil } from "react-icons/fa6";
import { LuCookingPot } from "react-icons/lu";
import { TbMeat } from "react-icons/tb";

import GroceryItem from "./GroceryItem";
import type { GroceryItem as GroceryItemType } from "../../data/groceryData";
import { useGroceryContext } from "../context/GroceryContext";

interface Props {
  date: string;
  items: GroceryItemType[];
  recipes: string[];
  index: number;
}

const GroceryList = ({ date, items, recipes, index }: Props) => {
  const { isEditingList, setIsEditingList, addItemToList } =
    useGroceryContext();

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl border border-slate-700 bg-slate-800 px-6 py-5 text-white">
        {/* Top row */}

        <div className="flex flex-row min-h-[40px] justify-between items-center">
          <h3 className="text-xl font-medium">{date}</h3>
          {!isEditingList[index] && (
            <button
              onClick={() => {
                setIsEditingList(index, true);
              }}
              className="flex py-2 px-4 text-gray-400 items-center rounded-lg hover:bg-slate-700 hover:cursor-pointer hover:text-white"
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
            <h4 className="text-gray-400">
              {items.length != 0 ? "Items list" : "No grocery items to show"}
            </h4>
          </div>

          <ul className="flex flex-col gap-3">
            {items.map((item) => (
              <GroceryItem key={item.id} item={item} listIndex={index} />
            ))}
            {isEditingList[index] || items.length === 0 ? (
              <button
                onClick={() => {
                  if (isEditingList[index]) {
                    addItemToList(index);
                  } else if (items.length === 0) {
                    setIsEditingList(index, true);
                    addItemToList(index);
                  }
                }}
                className={`mt-2 ${
                  items.length === 0 ? "min-h-[64px]" : "min-h-[48px]"
                } text-gray-400 rounded border-2 border-dashed
                 border-slate-700 hover:border-slate-600 hover:text-white`}
              >
                + Add Item
              </button>
            ) : null}
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

          {isEditingList[index] && (
            <button
              onClick={() => setIsEditingList(index, false)}
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
