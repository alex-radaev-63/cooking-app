import { useRef, useState, useEffect } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaPencil,
  FaTrashCan,
  FaEllipsisVertical,
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
  const [menuOpen, setMenuOpen] = useState(false);

  const { user } = useAuth();

  const listitemsRef = useRef<HTMLTextAreaElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

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

  // Clicking outside of context menu closes it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col  gap-8 shadow-card rounded-xl bg-[var(--color-card-bg)] px-6 pr-8 py-5">
        {/* Top row */}
        <div className="flex flex-col justify-center">
          {/* Top row in a card - Date, status and context menu */}
          <div className="flex justify-between items-center">
            <div className="flex flex-row gap-3 items-center">
              {/* Heading (date) */}
              <h3 className="text-lg mt-1 font-semibold text-[var(--color-secondary)]">
                {date}
              </h3>
              {/* Complete status */}
              {isCompleted && (
                <span className="flex flex-col mt-0.5 pt-0.5 h-[24px] justify-center px-3 text-xs uppercase font-bold text-[#16A34A] bg-[#DCFCE7] rounded-4xl">
                  complete
                </span>
              )}
            </div>

            {/* Context menu for editing list */}
            {!isEditingList[id] && user && (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((o) => !o)}
                  className="flex h-9 w-9 mr-[-8px] items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition cursor-pointer"
                >
                  <FaEllipsisVertical size={16} />
                </button>

                {menuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-44 rounded-lg
                    bg-white shadow-lg border border-gray-200
                    overflow-hidden z-50"
                  >
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        setIsEditingList(id, true);
                      }}
                      className="flex w-full items-center gap-3 px-4 py-3
                    hover:bg-gray-100 cursor-pointer"
                    >
                      <FaPencil size={13} />
                      Edit
                    </button>

                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        deleteList(id, true);
                      }}
                      className="flex w-full items-center gap-3 px-4 py-3
                    text-red-600 hover:bg-red-50 cursor-pointer"
                    >
                      <FaTrashCan size={13} />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}

            {user && !isEditingList[id] ? (
              <></>
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
          </div>
        </div>

        {/* Divider */}
        <div className="border-t my-[-8px] border-[var(--color-outline)]" />

        {/* Grocery items */}
        <div className="flex flex-col relative gap-3">
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
                  className="absolute right-0 bottom-0 flex items-center text-[var(--color-text-secondary)] cursor-pointer"
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

        {/* Divier */}
        {/* <div className="border-t border-[var(--color-outline)]" /> */}

        {/* Total price of groceries (grocery bill) */}
        <div className="flex flex-col gap-4 mb-2 justify-between items-end">
          <div className="flex w-full justify-end gap-4 items-center ">
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

          {user && !isEditingList[id] ? (
            <></>
          ) : (
            <>
              <button
                onClick={handleSaveEdits}
                className="flex py-2 mr-4 text-md font-medium text-gray-400 items-center hover:text-gray-600 cursor-pointer"
                disabled={isSavingList[id]}
              >
                {isSavingList[id] ? "Saving..." : "Save Edits"}
              </button>

              {saveErrors[id] && (
                <p className="text-red-500 text-sm mt-1">{saveErrors[id]}</p>
              )}
            </>
          )}
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
