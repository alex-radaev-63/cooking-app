import { NavLink } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { FiMenu, FiX, FiChevronDown, FiCheck } from "react-icons/fi";
import { useAuth } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";
import { householdManageDB } from "../services/householdManageDB";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  // const [isRecipesOpen, setIsRecipesOpen] = useState(false);
  const { user, logOut, openAuth, householdId, selectHousehold } = useAuth();

  const [households, setHouseholds] = useState<any[]>([]);

  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "My Profile";

  // useEffect(() => {
  //   let timeout: ReturnType<typeof setTimeout>;

  //   if (!open) {
  //     timeout = setTimeout(() => {
  //       setIsRecipesOpen(false);
  //     }, 350);
  //   }

  //   return () => clearTimeout(timeout);
  // }, [open]);

  // Closing profile dropdown on clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Getting a list of user households
  useEffect(() => {
    if (!user) return;

    const fetchHouseholds = async () => {
      try {
        const data = await householdManageDB.getUserHouseholds(user.id);
        setHouseholds(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchHouseholds();
  }, [user]);

  const resetNavigation = async () => {
    await logOut();
    navigate("/", { replace: true });
  };

  return (
    <header className="flex flex-row justify-between items-center h-[60px] p-2 pl-4 border-b-1 border-[var(--color-outline)] bg-[var(--color-card-bg)]">
      <NavLink to="/">
        <div className="flex h-8 text-[var(--color-primary)] font-gluten font-medium text-4xl">
          <span className="text-4xl">
            Yum
            <span className="text-3xl">m</span>
            <span className="text-2xl">m</span>
          </span>
        </div>
      </NavLink>

      {/* Desktop Menu */}
      <nav className="hidden sm:flex gap-0 items-stretch h-full">
        <NavLink className="main-nav-link" to="/">
          Grocery Lists
        </NavLink>

        {/* <div className="main-nav-link relative justify-center group">
          <NavLink to="/recipes">
            <button type="button" className="flex items-center cursor-pointer">
              Recipes <FaChevronDown size={12} className="ml-2 pt-0.5" />
            </button>
          </NavLink>

          <div
            className="absolute top-full opacity-0 translate-y-4 group-hover:opacity-100 
            group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto
            transition-all duration-350 ease-in-out z-10"
          >
            <RecipesDropdownMenu />
          </div>
        </div>

        <NavLink className="main-nav-link" to="/overview">
          My Dashboard
        </NavLink> */}

        {/* Desktop user profile */}
        {user ? (
          <div className="block relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen((p) => !p)}
              className="flex h-full px-6 items-center cursor-pointer gap-2 text-[var(--color-text)]/85 hover:text-[var(--color-text)]/100 transition"
            >
              <span>{displayName}</span>
              <FiChevronDown
                className={`transition-transform ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 p-2 min-w-60 rounded-lg text-gray-400 bg-slate-800 border border-slate-700 shadow-lg overflow-hidden z-50">
                <div className="px-4 py-2 text-xs uppercase text-gray-500">
                  Groups
                </div>

                {households.map((household) => {
                  const isActive = household.id === householdId;

                  console.log({
                    householdId,
                    household,
                    isActive,
                  });

                  return (
                    <button
                      key={household.id}
                      className={`w-full flex items-center justify-between text-left px-4 py-2 rounded hover:text-white cursor-pointer transition ${
                        isActive ? "text-white bg-slate-700" : ""
                      }`}
                      onClick={() => {
                        selectHousehold(household.id);
                        setProfileOpen(false);
                      }}
                    >
                      <span>{household.name}</span>

                      {isActive && <FiCheck size={16} />}
                    </button>
                  );
                })}

                <div className="border-t border-slate-700 my-2 mx-4" />

                <button
                  className="w-full text-left px-4 py-2 hover:text-white cursor-pointer"
                  onClick={() => {
                    setProfileOpen(false);
                    setOpen(false);
                    navigate("/households");
                  }}
                >
                  Manage households
                </button>

                <button
                  className="w-full text-left px-4 py-2 hover:text-white cursor-pointer"
                  onClick={() => {
                    setProfileOpen(false);
                    logOut();
                    resetNavigation();
                  }}
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            className="btn-primary hidden sm:block"
            onClick={() => openAuth("login")}
          >
            Log In
          </button>
        )}
      </nav>

      <div className="flex sm:hidden justify-end items-center">
        {user && (
          <div className="flex sm:hidden h-full px-6 items-center gap-2 transition">
            {displayName}
          </div>
        )}

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setOpen((o) => !o)}
          className="sm:hidden p-2 pr-4 hover:cursor-pointer text-[var(--color-text)]"
          aria-label="Open main menu"
        >
          {open ? (
            <FiX size={24} className="" />
          ) : (
            <FiMenu size={24} className="" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <nav
        className={`absolute z-999 inset-x-0 top-[72px]
              mx-2 overflow-hidden rounded-xl shadow-2xl border border-slate-700 bg-slate-800
              text-gray-300 transition-[max-height] duration-350 ease-in
              sm:hidden ${
                open ? "max-h-screen" : "max-h-0 border-0 duration-350 ease-out"
              }`}
      >
        <ul className="flex flex-col gap-1 px-4 py-3 text-lg">
          {/* <li>
            <NavLink
              onClick={() => setOpen(false)}
              to="/"
              className="block px-4 py-4"
            >
              Groceries
            </NavLink>
          </li> */}

          {/* <li>
            <button
              onClick={() => setIsRecipesOpen((o) => !o)}
              className={`flex w-full items-center justify-between px-4 py-4 rounded-lg 
                hover:cursor-pointer hover:bg-slate-700 transition-colors ${
                  isRecipesOpen ? "bg-slate-700" : "bg-slate-800"
                }`}
            >
              Recipes
              <FaChevronDown
                size={14}
                className={`transition-transform duration-200 ${
                  isRecipesOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`transition-all duration-350 ease-out overflow-hidden ${
                isRecipesOpen
                  ? "max-h-[1000px] opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <RecipesDropdownMenu />
            </div>
          </li>*/}
          {user && (
            <li>
              <div className="px-4 py-2 text-xs uppercase text-gray-500">
                Groups
              </div>

              {households.map((household) => {
                const isActive = household.id === householdId;

                return (
                  <button
                    key={household.id}
                    className={`main-nav-link w-full mb-1 justify-between **:${
                      isActive ? "text-white bg-slate-700" : "hover:text-white"
                    }`}
                    onClick={() => {
                      selectHousehold(household.id);
                      setOpen(false);
                    }}
                  >
                    <span>{household.name}</span>

                    {isActive && <FiCheck size={16} />}
                  </button>
                );
              })}

              <div className="border-t border-slate-700 my-2 mx-4" />
            </li>
          )}

          <li>
            <button
              className="main-nav-link w-full"
              onClick={() => {
                setOpen(false);
                navigate("/");
              }}
            >
              Grocery Lists
            </button>
          </li>

          {user && (
            <li>
              <button
                className="main-nav-link w-full"
                onClick={() => {
                  setOpen(false);
                  navigate("/households");
                }}
              >
                Manage households
              </button>
            </li>
          )}

          <li className="mt-8 mb-4">
            {user ? (
              <button
                className="btn-destructive-primary w-full"
                onClick={() => {
                  logOut();
                  setOpen(false);
                  resetNavigation();
                }}
              >
                Log Out
              </button>
            ) : (
              <button
                className="btn-primary w-full"
                onClick={() => {
                  openAuth("login");
                  setOpen(false);
                }}
              >
                Log In
              </button>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
