type SocialButtonProps = {
  icon: React.ReactNode;
  onClick: () => void | Promise<void>;
};

export default function SocialButton({ icon, onClick }: SocialButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        w-12 h-12
        flex items-center justify-center
        bg-white/100
        hover:scale-[1.05]
        cursor-pointer
        duration-0.35 transition-scale ease-out
        rounded-lg
        border border-gray-300
        hover:bg-gray-100
        transition
      "
    >
      {icon}
    </button>
  );
}
