import type { GroceryItem as GroceryItemType } from "../../data/groceryData";
import { useGroceryContext } from "../context/GroceryContext";

type Props = {
  item: GroceryItemType;
  listIndex: number;
};

function GroceryItem({ item, listIndex }: Props) {
  const { toggleItemChecked } = useGroceryContext();

  return (
    <label className="flex flex-row gap-3 min-h-10 items-center">
      <input
        type="checkbox"
        checked={item.checked}
        onChange={() => toggleItemChecked(listIndex, item.id)}
        className="accent-green-500 min-h-5 min-w-5"
      />
      <span className={item.checked ? "text-slate-500" : ""}>{item.name}</span>
    </label>
  );
}

export default GroceryItem;
