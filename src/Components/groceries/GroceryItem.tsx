import type { GroceryItem as GroceryItemType } from "../../data/groceryData";

const GroceryItem: React.FC<GroceryItemType> = ({ name, checked }) => {
  return (
    <label className="flex flex-row gap-3 min-h-10 items-center">
      <input
        type="checkbox"
        checked={checked}
        className="accent-green-500 min-h-5 min-w-5"
      />
      <span className={checked ? "text-slate-500" : ""}>{name}</span>
    </label>
  );
};

export default GroceryItem;
