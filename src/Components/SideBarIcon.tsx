interface Props {
  icon: React.ReactNode;
  text: string;
}

const SideBarIcon = ({ icon, text }: Props) => {
  return (
    <div className="sidebar-icon group">
      {icon}
      <span className="sidebar-tooltip group-hover:scale-100">{text}</span>
    </div>
  );
};

export default SideBarIcon;
