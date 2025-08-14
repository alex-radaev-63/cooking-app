import { useEffect, useState, useRef } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useOutsidePopUpClose } from "../../hooks/useOutsidePopUpClose";
import { useAuth } from "../context/AuthContext";

interface LoginPopUpProps {
  open: boolean;
  onClose: () => void;
}

const LoginPopUp = ({ open, onClose }: LoginPopUpProps) => {
  const { logIn } = useAuth();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);

  const loginRef = useRef<HTMLDivElement | null>(null);
  useOutsidePopUpClose(
    loginRef as React.RefObject<HTMLDivElement>,
    onClose,
    open
  );

  useEffect(() => {
    if (!open) {
      setLogin("");
      setPassword("");
      setAuthError("");
      setLoading(false);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError("");

    const { success, error } = await logIn(login, password);
    setLoading(false);

    if (success) {
      onClose(); // ✅ Close popup automatically on login
    } else {
      setAuthError(error || "Login failed");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed px-4 inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        ref={loginRef}
        className="relative w-full max-w-sm rounded-xl bg-slate-800 p-6 text-white shadow-xl"
      >
        <button
          onClick={onClose}
          className="absolute top-1 right-3 text-gray-500 text-3xl font-regular hover:cursor-pointer hover:text-gray-400"
          aria-label="Close login popup"
        >
          ×
        </button>

        <h2 className="mb-8 text-2xl scale-y-115 font-gluten font-medium text-green-300">
          Welcome to Yummm
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label-input">Login</label>
            <input
              type="text"
              placeholder="you@example.com"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className={`input-default ${
                authError ? "input-error" : "input-focus"
              }`}
            />
          </div>

          <div>
            <label className="label-input">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`input-default ${
                  authError ? "input-error" : "input-focus"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-4 text-gray-400 hover:text-white hover:cursor-pointer"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          {authError && <p className="text-sm text-red-400">{authError}</p>}

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading || !login.trim() || !password.trim()}
              className="mt-8 btn-primary px-6 min-h-12"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPopUp;
