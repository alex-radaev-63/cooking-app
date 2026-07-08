import { FaPlus } from "react-icons/fa6";
import { FiChevronDown, FiCheck } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
import { useGroceryContext } from "../Components/context/GroceryContext";
import GroceryFeed from "../Components/groceries/GroceryFeed";
import { useAuth } from "../Components/context/AuthContext";
import { householdManageDB } from "../services/householdManageDB";

const Groceries = () => {
  const { user, loading, openAuth, householdId, selectHousehold } = useAuth();
  const { createNewList } = useGroceryContext();

  const [households, setHouseholds] = useState<any[]>([]);
  const [householdOpen, setHouseholdOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setHouseholdOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchHouseholds = async () => {
      try {
        const data = await householdManageDB.getUserHouseholds(user.id);
        setHouseholds(data);
      } catch (error) {
        console.error("Failed to fetch households:", error);
      }
    };

    fetchHouseholds();
  }, [user]);

  const currentHousehold =
    households.find((household) => household.id === householdId) ??
    households[0];

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-10 text-slate-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col max-w-[600px] mx-auto p-4 mt-6 gap-4">
      <div className="flex flex-col gap-8">
        <div className="flex flex-row justify-between min-h-10 items-end">
          <div>
            <h1 className="text-[28px] font-medium text-white">
              Grocery Lists
            </h1>

            {user && currentHousehold && (
              <div className="relative mt-1" ref={dropdownRef}>
                <button
                  onClick={() => setHouseholdOpen((prev) => !prev)}
                  className="flex flex-wrap pr-4 text-sm text-gray-400 cursor-pointer"
                >
                  <span>Current group:&nbsp;</span>

                  <div className="flex gap-1 items-center">
                    <span className="text-gray-200">
                      {currentHousehold.name}
                    </span>
                    <FiChevronDown
                      size={14}
                      className={`transition-transform ${
                        householdOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                {householdOpen && (
                  <div className="absolute left-0 mt-2 w-56 p-2 rounded-lg bg-slate-800 border border-slate-700 shadow-lg z-50">
                    {households.map((household) => {
                      const isActive = household.id === householdId;

                      return (
                        <button
                          key={household.id}
                          className={`main-nav-link w-full justify-between mb-1 text-slate-400 ${
                            isActive ? "text-white bg-slate-700" : ""
                          }`}
                          onClick={() => {
                            selectHousehold(household.id);
                            setHouseholdOpen(false);
                          }}
                        >
                          <span>{household.name}</span>

                          {isActive && <FiCheck size={15} />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {user ? (
            <button
              onClick={createNewList}
              className="flex items-center min-h-10 text-gray-200 gap-1 rounded-lg 
                border border-slate-700 bg-slate-800 px-3 py-2 text-sm 
                hover:bg-slate-700 hover:cursor-pointer transition-all ease-out duration-300"
            >
              <FaPlus size={14} className="mr-1.5 mt-0.5" />
              New&nbsp;List
            </button>
          ) : (
            <span className="text-slate-500">
              Please
              <button
                onClick={() => openAuth("login")}
                className="underline hover:text-slate-100 mx-1.5 cursor-pointer transition-colors"
              >
                log in
              </button>
              to edit grocery lists
            </span>
          )}
        </div>

        {user && <GroceryFeed />}
      </div>
    </div>
  );
};

export default Groceries;
