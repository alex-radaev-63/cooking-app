import type { GroceryListCardProps } from "../../data/groceryData";
import { useEffect, useState } from "react";
import { FaPencil } from "react-icons/fa6";

const GroceryListCard = ({ week, items, recipes }: GroceryListCardProps) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(
    items.reduce((acc, item) => ({ ...acc, [item.name]: item.checked }), {})
  );

  const toggleItem = (name: string) => {
    setCheckedItems((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editableItems, setEditableItems] = useState(items);

  useEffect(() => {
    setEditableItems(items);
  }, [items]);

  const handleItemChange = (index: number, value: string) => {
    const updated = [...editableItems];
    updated[index].name = value;
    setEditableItems(updated);
  };

  const handleDeleteItem = (index: number) => {
    const updated = [...editableItems];
    updated.splice(index, 1);
    setEditableItems(updated);
  };

  const handleAddNewItem = () => {
    // Prevent adding multiple empty fields
    if (
      editableItems.length &&
      editableItems[editableItems.length - 1].name.trim() === ""
    ) {
      return;
    }
    setEditableItems([...editableItems, { name: "", checked: false }]);
  };

  const toggleEditMode = () => {
    if (isEditing) {
      const cleaned = editableItems.filter((item) => item.name.trim() !== "");
      setEditableItems(cleaned);
      // Optionally sync with parent state here if needed
    }
    setIsEditing((prev) => !prev);
  };

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800 px-6 py-5 text-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{week}</h3>
        <FaPencil
          size={16}
          className="text-slate-400 hover:text-white cursor-pointer"
          onClick={toggleEditMode}
        />
      </div>

      <div className="flex flex-col">
        {isEditing
          ? editableItems.map(({ name }, index) => (
              <div
                key={index}
                className="flex relative items-center gap-2 mb-2"
              >
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleItemChange(index, e.target.value)}
                  className="flex-1 bg-slate-700 text-white p-2 rounded-md"
                />
                <button
                  onClick={() => handleDeleteItem(index)}
                  className="absolute z-50 top-0 right-3 text-3xl text-gray-400 hover:text-gray-200"
                >
                  ×
                </button>
              </div>
            ))
          : items.map(({ name }) => (
              <label key={name} className="flex items-center gap-2 min-h-10">
                <input
                  type="checkbox"
                  checked={checkedItems[name]}
                  onChange={() => toggleItem(name)}
                  className="accent-green-500 min-h-5 min-w-5"
                />
                <span className={checkedItems[name] ? " text-slate-400" : ""}>
                  {name}
                </span>
              </label>
            ))}

        {isEditing && (
          <button
            type="button"
            onClick={handleAddNewItem}
            className="w-full mt-4 px-3 py-2 text-left rounded-md border-2 border-dotted border-slate-500 bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
          >
            + Add Item
          </button>
        )}
      </div>

      <div className="mt-6 border-t border-slate-700 pt-4">
        <p className="mb-2 text-sm text-slate-400">Planned recipes</p>
        <ul className="text-sm space-y-1">
          {recipes.map((recipe) => (
            <li key={recipe}>{recipe}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GroceryListCard;
