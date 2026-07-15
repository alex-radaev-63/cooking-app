import { useRef, useState, useEffect } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaPencil,
  FaTrashCan,
  FaEllipsisVertical,
  FaCheck,
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
  const [markCompleteOnSave, setMarkCompleteOnSave] = useState(false);

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

    const finalItems = markCompleteOnSave
      ? newItems.map((item) => ({
          ...item,
          checked: true,
        }))
      : newItems;

    await setIsEditingList(id, false, finalItems);
  };

  // Set a limit for max displayed items per list (by default)
  const displayedItems = showAll ? items : items.slice(0, 5);

  // Checking if list is complete
  const isCompleted = items.length > 0 && items.every((item) => item.checked);

  // Set checkbox state based on whether list is complete or not at the moment user goes into editing mode
  useEffect(() => {
    if (isEditingList[id]) {
      setMarkCompleteOnSave(isCompleted);
    }
  }, [isEditingList[id], isCompleted]);

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
            <div className={`flex gap-3 items-center`}>
              {/* Heading (date) */}
              <h3 className="text-lg mt-1 font-semibold text-[var(--color-secondary)]">
                {date}
              </h3>

              {/* Complete status */}
              {!isEditingList[id] && isCompleted && (
                <span className="flex flex-col mt-0.5 pt-0.5 h-[24px] justify-center px-3 text-xs uppercase font-bold text-primary bg-primary-light rounded-4xl">
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
                  className="flex mt-2 py-2 px-4 gap-2 items-center
                    rounded-xl border border-primary
                    text-md font-medium text-primary 
                    hover:bg-primary-light hover:border-primary-light
                    transition duration-250 ease-out"
                  disabled={isSavingList[id]}
                >
                  <FaCheck />
                  {isSavingList[id] ? "Saving..." : "Save"}
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
        {(isEditingList[id] || items.length > 0) && (
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
                        className="
                        peer
                        appearance-none
                        min-h-6 min-w-6
                        rounded-md
                        border-[1.5px] border-slate-400
                        checked:bg-primary
                        checked:border-primary
                        cursor-pointer
                        relative
                      "
                      />

                      <svg
                        className="
                        pointer-events-none
                        absolute
                        hidden
                        h-4.5 w-4.5
                        ml-[2.5px]
                        text-white
                        peer-checked:block
                      "
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <path
                          d="M4 10.5L8 14.5L16 6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>

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
                        See more{" "}
                        <FaChevronDown className="ml-2 text-sm mt-0.5" />
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
        )}

        {items.length === 0 && !isEditingList[id] && (
          <button
            className="flex flex-row justify-center items-center 
                w-full h-[120px] 
                border-[1.5px] border-dashed rounded-lg border-slate-300
                text-text-secondary/75 font-medium
                hover:text-primary hover:bg-primary-light hover:border-primary
                transition-all ease-out duration-250"
            onClick={() => setIsEditingList(id, true)}
          >
            + Add first item
          </button>
        )}

        {/* Total price of groceries (grocery bill) */}
        {(isEditingList[id] || items.length > 0) && (
          <div className="flex flex-col gap-4 mb-2 justify-between items-stretch">
            <div className="flex flex-wrap mb-2 justify-end items-center">
              {/* Marking list complete - setting checked status to all checkboxes */}
              {user && isEditingList[id] && (
                <label
                  className={`flex items-center flex-grow gap-3 relative ${
                    isCompleted ? "opacity-30 cursor-not-allowed" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={markCompleteOnSave}
                    onChange={(e) => setMarkCompleteOnSave(e.target.checked)}
                    className="
        peer
        appearance-none
        min-h-6 min-w-6
        rounded-md
        border-[1.5px] border-slate-400
        checked:bg-primary
        checked:border-primary
        disabled:cursor-not-allowed
        cursor-pointer
        relative
      "
                  />

                  <svg
                    className="
        pointer-events-none
        absolute
        hidden
        h-4.5
        w-4.5
        ml-[2.5px]
        text-white
        peer-checked:block
      "
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <path
                      d="M4 10.5L8 14.5L16 6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <span className="font-medium text-slate-600">
                    Mark list complete
                  </span>
                </label>
              )}

              {/* Total */}

              <div className="flex gap-4 items-center ">
                <h4 className="font-semibold text-slate-500">Total</h4>

                <div>
                  {isEditingList[id] ? (
                    <input
                      type="number"
                      value={total ?? 0} // default to 0 if total is null
                      onChange={(e) => setTotal(id, parseFloat(e.target.value))}
                      className="w-[100px] h-[40px] p-1 rounded text-right bg-gray-100 text-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-text-secondary)]"
                      step="0.01"
                      min="0"
                    />
                  ) : (
                    <span className="text-xl font-bold">
                      {total !== null ? total.toFixed(2) : "-"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {user && !isEditingList[id] ? (
              <></>
            ) : (
              <div className="w-full flex justify-end">
                <button
                  onClick={handleSaveEdits}
                  className="flex mt-2 py-2 px-4 gap-2 w-fit items-center
                rounded-xl border border-primary
                text-md font-medium text-primary 
                hover:bg-primary-light hover:border-primary-light
                transition duration-250 ease-out"
                  disabled={isSavingList[id]}
                >
                  <FaCheck />
                  {isSavingList[id] ? "Saving..." : "Save"}
                </button>

                {saveErrors[id] && (
                  <p className="text-red-500 text-sm mt-1">{saveErrors[id]}</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroceryList;
