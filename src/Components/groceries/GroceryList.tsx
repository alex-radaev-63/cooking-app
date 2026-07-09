import { useRef, useState, useEffect } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaPencil,
  FaTrashCan,
} from "react-icons/fa6";
import { useGroceryContext } from "../context/GroceryContext";
import { useAuth } from "../context/AuthContext";
import type { GroceryList as GroceryListType } from "../../types/grocery";
import { reconcileItems } from "../../utils/reconcileItems";

const GroceryList = ({ id, date, items, total }: GroceryListType) => {
  const {
    isEditingList,
    setIsEditingList,
    isSavingList,
    saveErrors,
    deleteList,
    toggleItemChecked,
    setTotal,
  } = useGroceryContext();

  const [editText, setEditText] = useState("");
  const [showAll, setShowAll] = useState(false);

  const { user } = useAuth();

  const listitemsRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (listitemsRef.current) {
      listitemsRef.current.style.height = "auto";
      listitemsRef.current.style.height =
        listitemsRef.current.scrollHeight + "px";
    }
  }, [editText, isEditingList[id]]);

  useEffect(() => {
    if (isEditingList[id]) {
      setEditText(items.map((item) => item.name).join("\n"));
    }
  }, [isEditingList[id], items]);

  const handleSaveEdits = async () => {
    const lines = editText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const newItems = reconcileItems(items, lines);

    await setIsEditingList(id, false, newItems);
  };

  // Set a limit for max displayed items per list (by default)
  const displayedItems = showAll ? items : items.slice(0, 5);

  // Checking if list is complete
  const isCompleted = items.length > 0 && items.every((item) => item.checked);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col  gap-4 shadow-card rounded-xl bg-[var(--color-card-bg)] px-6 py-5">
        {/* Top row */}
        <div className="flex flex-col justify-center">
          <div className="flex flex-row gap-3 items-center">
            <h3 className="text-md mt-1 font-semibold text-[var(--color-secondary)]">
              {date}
            </h3>
            {isCompleted && (
              <span className="flex flex-col mt-0.5 pt-0.5 h-[24px] justify-center px-3 text-xs uppercase font-bold text-[#16A34A] bg-[#DCFCE7] rounded-4xl">
                complete
              </span>
            )}
          </div>

          <div className="flex justify-between items-center">
            {user && !isEditingList[id] ? (
              <button
                onClick={() => setIsEditingList(id, true)}
                className="flex py-2 text-md font-medium text-gray-400 items-center hover:text-gray-600 cursor-pointer"
              >
                <FaPencil size="12px" className="mr-2" />
                Edit
              </button>
            ) : (
              <>
                <button
                  onClick={handleSaveEdits}
                  className="flex py-2 text-md font-medium text-gray-400 items-center hover:text-gray-600 cursor-pointer"
                  disabled={isSavingList[id]}
                >
                  {isSavingList[id] ? "Saving..." : "Save Edits"}
                </button>
                {saveErrors[id] && (
                  <p className="text-red-500 text-sm mt-1">{saveErrors[id]}</p>
                )}
              </>
            )}

            <button
              onClick={() => deleteList(id, true)}
              className="flex p-2 mb-1 text-gray-400 items-center rounded-lg hover:bg-gray-200 hover:text-gray-600 cursor-pointer"
            >
              <FaTrashCan size="14px" />
              {/* Delete List */}
            </button>
          </div>
        </div>

        <div className="border-t border-[var(--color-outline)]" />

        {/* Grocery items */}
        <div className="flex flex-col relative my-2 gap-3">
          {!isEditingList[id] ? (
            <>
              <ul className="flex flex-col gap-3">
                {displayedItems.map((item) => (
                  <label
                    key={item.id}
                    className="flex flex-row gap-3 items-center min-h-[28px]"
                  >
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => toggleItemChecked(id, item.id)}
                      className="accent-[#16A34A] min-h-5 min-w-5"
                    />
                    <span className="text-slate-500">{item.name}</span>
                  </label>
                ))}
              </ul>

              {items.length > 7 && (
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="absolute right-4 bottom-0 flex items-center text-[var(--color-text-secondary)] cursor-pointer"
                >
                  {showAll ? (
                    <>
                      See less <FaChevronUp className="ml-2 text-sm mt-0.5" />
                    </>
                  ) : (
                    <>
                      See more <FaChevronDown className="ml-2 text-sm mt-0.5" />
                    </>
                  )}
                </button>
              )}
            </>
          ) : (
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              ref={listitemsRef}
              className="w-full min-h-48 bg-gray-100 text-[var(--color-text-secondary)] rounded p-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none overflow-hidden"
              placeholder="Enter grocery items"
              contentEditable
            />
          )}
        </div>

        <div className="border-t border-[var(--color-outline)]" />

        {/* Total price of groceries (grocery bill) */}
        <div className="flex flex-row justify-between items-end">
          <div className="flex w-full justify-between items-center ">
            <h4 className="font-semibold text-slate-500">Total</h4>
            <div>
              {isEditingList[id] ? (
                <input
                  type="number"
                  value={total ?? 0} // default to 0 if total is null
                  onChange={(e) => setTotal(id, parseFloat(e.target.value))}
                  className="w-[120px] h-[40px] p-1 rounded text-right bg-gray-100 text-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-text-secondary)]"
                  step="0.01"
                  min="0"
                />
              ) : (
                <span className="text-xl font-bold">
                  {total !== null ? `$ ${total.toFixed(2)}` : "-"}
                </span>
              )}
            </div>
          </div>
        </div>

        {items.length === 0 && !isEditingList[id] && (
          <button
            className="flex flex-row justify-center items-center w-full h-[64px] 
            border-2 border-dashed rounded-lg border-slate-600 text-slate-500 font-medium
             hover:text-slate-300 hover:cursor-pointer hover:bg-slate-700/50
             transition-all ease-out duration-250"
            onClick={() => setIsEditingList(id, true)}
          >
            + Add first item
          </button>
        )}
      </div>
    </div>
  );
};

export default GroceryList;
