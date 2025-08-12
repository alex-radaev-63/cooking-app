import { FaPencil, FaTrashCan } from "react-icons/fa6";
import { LuCookingPot } from "react-icons/lu";
import { TbMeat } from "react-icons/tb";
import GroceryItem from "./GroceryItem";
import type { GroceryItem as GroceryItemType } from "../../data/groceryData";
import { useGroceryContext } from "../context/GroceryContext";

interface Props {
  id: string; // <-- changed from index:number
  date: string;
  items: GroceryItemType[];
  recipes: string[];
  index: number; // keep numeric index for internal use if needed (like key)
}

const GroceryList = ({ id, date, items, recipes }: Props) => {
  const {
    isEditingList,
    setIsEditingList,
    addItemToList,
    isSavingList,
    saveErrors,
    deleteList,
  } = useGroceryContext();

  // Async save handler calling context's async function
  const handleSaveEdits = async () => {
    await setIsEditingList(id, false);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl border border-slate-700 bg-slate-800 px-6 py-5 text-white">
        {/* Top row */}
        <div className="flex flex-row min-h-[40px] justify-between items-center">
          <h3 className="text-xl font-medium">{date}</h3>

          {!isEditingList[id] && (
            <button
              onClick={() => setIsEditingList(id, true)}
              className="flex py-2 px-4 text-gray-400 items-center rounded-lg hover:bg-slate-700 hover:cursor-pointer hover:text-white"
            >
              <FaPencil size="12px" className="mr-2" />
              Edit
            </button>
          )}

          {isEditingList[id] && (
            <button
              onClick={() => deleteList(id, true)}
              className="flex py-2 px-4 text-gray-400 items-center rounded-lg hover:bg-slate-700 hover:cursor-pointer hover:text-white"
            >
              <FaTrashCan size="12px" className="mr-2" />
              Delete List
            </button>
          )}
        </div>

        {/* Grocery items */}
        <div className="flex flex-col mt-4 mb-2 gap-3">
          {/*
          <div className="flex flex-row gap-2 items-center">
            <TbMeat size={16} className="text-gray-400 mt-0.5" />
            <h4 className="text-gray-400">
              {items.length !== 0 ? "Items list" : "No grocery items to show"}
            </h4>
          </div> */}

          <ul className="flex flex-col gap-3">
            {items.map((item) => (
              <GroceryItem key={item.id} item={item} listId={id} />
            ))}
            {isEditingList[id] || items.length === 0 ? (
              <button
                onClick={() => {
                  if (isEditingList[id]) {
                    addItemToList(id);
                  } else if (items.length === 0) {
                    setIsEditingList(id, true);
                    addItemToList(id);
                  }
                }}
                className={`flex flex-row gap-2 justify-center items-center hover:cursor-pointer mt-2 ${
                  items.length === 0 ? "min-h-[64px]" : "min-h-[48px]"
                } text-gray-400 rounded border-2 border-dashed border-slate-700 hover:border-slate-600 hover:text-white`}
              >
                <TbMeat size={16} className="text-gray-400 mt-0.5" /> Add
                Grocery Item
              </button>
            ) : null}
          </ul>
        </div>

        {/* Recipes & Save Edits button */}
        <div
          className={` ${
            !isEditingList[id] ? "hidden" : "flex flex-row"
          }  pt-8 justify-between items-end `}
        >
          {(isEditingList[id] || recipes.length > 0) && (
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
          )}

          {isEditingList[id] && (
            <div className="flex flex-col items-end">
              <button
                onClick={handleSaveEdits}
                className="btn-primary"
                disabled={isSavingList[id]}
              >
                {isSavingList[id] ? "Saving..." : "Save Edits"}
              </button>
              {saveErrors[id] && (
                <p className="text-red-500 text-sm mt-1">{saveErrors[id]}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroceryList;
