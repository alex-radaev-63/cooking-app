import type { GroceryListCardProps } from "../../data/groceryData";
import { useState } from "react";
import { FaPencil } from "react-icons/fa6";

const GroceryListCard = ({ week, items, recipes }: GroceryListCardProps) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(
    items.reduce((acc, item) => ({ ...acc, [item.name]: item.checked }), {})
  );

  const toggleItem = (name: string) => {
    setCheckedItems((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800 px-6 py-5 text-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{week}</h3>
        <FaPencil
          size={16}
          className="text-slate-400 hover:text-white cursor-pointer"
        />
      </div>

      <div className="flex flex-col">
        {items.map(({ name }) => (
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
