import { useRef, useState, useEffect } from "react";
import { FaPencil, FaTrashCan } from "react-icons/fa6";
import { useGroceryContext } from "../context/GroceryContext";

interface Props {
  id: string;
  date: string;
  items: { id: number; name: string; checked: boolean }[];
  recipes: string[];
}

const GroceryList = ({ id, date, items }: Props) => {
  const {
    isEditingList,
    setIsEditingList,
    isSavingList,
    saveErrors,
    deleteList,
    toggleItemChecked,
  } = useGroceryContext();

  const [editText, setEditText] = useState("");

  const listitemsRef = useRef<HTMLTextAreaElement>(null);

  // Resizing text area when entering items
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
      .filter((line) => line !== "");

    const newItems = lines.map((name, index) => {
      const oldItem = items.find((item) => item.name === name);
      return {
        id: oldItem?.id ?? index + 1,
        name,
        checked: oldItem?.checked ?? false,
      };
    });

    await setIsEditingList(id, false, newItems);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl border border-slate-700 bg-slate-800 px-6 py-5 text-white">
        {/* Top row */}
        <div className="flex flex-row justify-between items-center">
          <h3 className="text-xl font-medium">{date}</h3>

          {!isEditingList[id] ? (
            <button
              onClick={() => setIsEditingList(id, true)}
              className="flex py-2 px-4 text-gray-400 items-center rounded-lg hover:bg-slate-700 hover:text-white cursor-pointer"
            >
              <FaPencil size="12px" className="mr-2" />
              Edit
            </button>
          ) : (
            <button
              onClick={() => deleteList(id, true)}
              className="flex py-2 px-4 text-gray-400 items-center rounded-lg hover:bg-slate-700 hover:text-white cursor-pointer"
            >
              <FaTrashCan size="12px" className="mr-2" />
              Delete List
            </button>
          )}
        </div>

        {/* Grocery items */}
        <div className="flex flex-col mt-4 mb-2 gap-3">
          {!isEditingList[id] ? (
            <ul className="flex flex-col gap-3">
              {items.map((item) => (
                <label
                  key={item.id}
                  className="flex flex-row gap-3 items-center min-h-[28px]"
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleItemChecked(id, item.id)}
                    className="accent-green-300 min-h-5 min-w-5"
                  />
                  <span className={item.checked ? "text-slate-500" : ""}>
                    {item.name}
                  </span>
                </label>
              ))}
            </ul>
          ) : (
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              ref={listitemsRef}
              className="w-full min-h-48 bg-slate-700 text-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-green-400 focus:text-white resize-none overflow-hidden"
              placeholder="Enter grocery items"
              contentEditable
            />
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
            <span className="">+ Add first item</span>
          </button>
        )}

        {/* Save button */}
        {isEditingList[id] && (
          <div className="flex flex-col items-end pt-8">
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
  );
};

export default GroceryList;
