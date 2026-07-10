import { useAuth } from "../context/AuthContext";
import LoginPopUp from "./LoginPopUp";
import SignUpPopUp from "./SignUpPopUp";
import { FiX } from "react-icons/fi";

const AuthModal = () => {
  const { isAuthOpen, authMode, closeAuth, openAuth } = useAuth();

  if (!isAuthOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={closeAuth}
    >
      <div
        className="relative w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeAuth}
          className="absolute top-6 right-6 text-gray-400 hover:text-text-primary text-2xl z-10 cursor-pointer"
          aria-label="Close modal"
        >
          <FiX size={24} />
        </button>

        {authMode === "login" ? (
          <LoginPopUp
            onClose={closeAuth}
            onSwitchToSignUp={() => openAuth("signup")}
          />
        ) : (
          <SignUpPopUp
            onClose={closeAuth}
            onSwitchToLogin={() => openAuth("login")}
          />
        )}
      </div>
    </div>
  );
};

export default AuthModal;
