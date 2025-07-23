//import { FaChevronDown, FaPlus } from "react-icons/fa6";

import { GroceryProvider } from "../Components/context/GroceryContext";
import GroceryFeed from "../Components/groceries/GroceryFeed";

const Groceries = () => {
  return (
    <div className="flex flex-col max-w-[600px] mx-auto p-2 mt-6 gap-4">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-medium text-white">Groceries</h1>
        <GroceryProvider>
          <GroceryFeed />
        </GroceryProvider>
        {/*
        <div className="flex justify-between w-full gap-3">

          <button className="flex items-center min-h-10 text-gray-200 gap-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm hover:bg-slate-700">
            September 2024
            <FaChevronDown size={12} className="ml-1 text-gray-400" />
          </button>
          <button className="btn-primary text-sm">
            <FaPlus size={14} className="mr-1.5 mt-0.5 " /> New List
          </button>

        </div> */}
      </div>
    </div>
  );
};

export default Groceries;
