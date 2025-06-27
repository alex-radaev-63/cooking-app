import { BsPlus, BsFillLightningFill } from "react-icons/bs";
import SideBarIcon from "./SideBarIcon";
import { FaFire, FaPoo } from "react-icons/fa";

const SideBar = () => {
  return (
    <div
      className="fixed top-0 left-0 h-screen w-16 m-0 
    flex flex-col bg-gray-900 text-white shadow-lg"
    >
      <SideBarIcon icon={<FaFire size="28" />} text="Fire tooltip" />
      <SideBarIcon icon={<BsPlus size="32" />} text="Plus tooltip" />
      <SideBarIcon
        icon={<BsFillLightningFill size="20" />}
        text="Lightning tooltip"
      />
      <SideBarIcon icon={<FaPoo size="28" />} text="Poo tolltip" />
    </div>
  );
};

export default SideBar;
