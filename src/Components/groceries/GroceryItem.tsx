import type { GroceryItem as GroceryItemType } from "../../data/groceryData";
import { useGroceryContext } from "../context/GroceryContext";

interface Props {
  item: GroceryItemType;
  listIndex: number;
}

const GroceryItem = ({ item, listIndex }: Props) => {
  const { toggleItemChecked, isEditingList } = useGroceryContext();

  return (
    <>
      {!isEditingList[listIndex] ? (
        <div className="flex flex-row gap-3 items-center min-h-[28px]">
          <input
            type="checkbox"
            checked={item.checked}
            onChange={() => toggleItemChecked(listIndex, item.id)}
            className="accent-green-300 min-h-5 min-w-5"
          />
          <span className={item.checked ? "text-slate-500" : ""}>
            {item.name}
          </span>
        </div>
      ) : (
        <input
          type="text"
          defaultValue={item.name}
          className="min-h-[40px] bg-slate-700 text-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-green-400 focus:text-white"
        />
      )}
    </>
  );
};

export default GroceryItem;
