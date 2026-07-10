import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { FcGoogle } from "react-icons/fc";
import SocialButton from "./SocialButton";

interface LoginPopUpProps {
  onClose: () => void;
  onSwitchToSignUp: () => void;
}

const LoginPopUp = ({ onClose, onSwitchToSignUp }: LoginPopUpProps) => {
  const { logIn, signInWithProvider } = useAuth();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError("");

    const { success, error } = await logIn(login, password);

    setLoading(false);

    if (success) {
      onClose();
    } else {
      setAuthError(error || "Login failed");
    }
  };

  return (
    <div className="relative w-full max-w-sm rounded-xl bg-[var(--color-card-bg)] p-6 shadow-xl">
      <h2 className="mb-8 text-2xl font-bold text-text-primary">
        Welcome to Yummm
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="label-input">Email</label>
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
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-4 top-4 text-gray-400 hover:text-text-primary"
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
        </div>

        {authError && <p className="text-sm text-red-400">{authError}</p>}

        <button type="submit" className="w-full btn-primary min-h-12">
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>

      <div className="mt-8 text-center text-slate-400 text-sm">
        - Or Log In With -
      </div>

      <div className="flex justify-center mt-8">
        <SocialButton
          icon={<FcGoogle size={24} />}
          onClick={() => signInWithProvider("google")}
        />
      </div>

      <div className="text-slate-400 text-center mt-8">
        Don't have an account?{" "}
        <button
          className="underline hover:text-text-primary cursor-pointer"
          onClick={onSwitchToSignUp}
        >
          Sign up with email
        </button>
      </div>
    </div>
  );
};

export default LoginPopUp;
