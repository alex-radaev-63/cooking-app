type SocialButtonProps = {
  icon: React.ReactNode;
  text: string;
  onClick: () => void | Promise<void>;
};

export default function SocialButton({
  icon,
  text,
  onClick,
}: SocialButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        w-full h-12 px-4 gap-2
        flex items-center justify-center
        bg-white/100
        hover:scale-[1.02]
        cursor-pointer
        duration-0.35 transition-scale ease-out
        rounded-xl
        border border-gray-300
        hover:bg-gray-100
        shadow-md/5
        transition
      "
    >
      {icon}
      {text}
    </button>
  );
}
