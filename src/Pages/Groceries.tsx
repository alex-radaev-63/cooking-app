import { FaPlus } from "react-icons/fa6";

import { useGroceryContext } from "../Components/context/GroceryContext";
import GroceryFeed from "../Components/groceries/GroceryFeed";

const Groceries = () => {
  const { createNewList } = useGroceryContext();
  return (
    <div className="flex flex-col max-w-[600px] mx-auto p-4 mt-6 gap-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row justify-between">
          <h1 className="text-[28px] font-medium text-white">Grocery Lists</h1>
          <button
            onClick={createNewList}
            className="flex items-center min-h-10 text-gray-200 gap-1 rounded-lg 
            border border-slate-700 bg-slate-800 px-3 py-2 text-sm 
            hover:bg-slate-700 hover:cursor-pointer transition-all ease-out duration-300"
          >
            <FaPlus size={14} className="mr-1.5 mt-0.5 " /> New List
          </button>
        </div>
        <GroceryFeed />
      </div>
    </div>
  );
};

export default Groceries;
