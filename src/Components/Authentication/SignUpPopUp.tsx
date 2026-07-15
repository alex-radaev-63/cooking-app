import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import SocialButton from "./SocialButton";
import { FcGoogle } from "react-icons/fc";

interface SignUpPopUpProps {
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const SignUpPopUp = ({ onClose, onSwitchToLogin }: SignUpPopUpProps) => {
  const { signInWithProvider, signUp } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError("");

    try {
      const { success, error } = await signUp(email, password, {
        full_name: fullName,
      });

      if (success) {
        onClose();
      } else {
        setAuthError(error || "Sign up failed");
      }
    } catch (err: any) {
      setAuthError(err.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-[95%] sm:max-w-sm m-auto rounded-xl  p-6 bg-[var(--color-card-bg)] shadow-xl">
      <h2 className="mb-8 text-2xl text-center font-bold">Create Account</h2>

      {/* OAuth */}

      <div className="flex justify-center mt-8">
        <SocialButton
          icon={<FcGoogle size={24} />}
          text="Continue with Google"
          onClick={() => signInWithProvider("google")}
        />
      </div>

      <div className="my-6 text-center text-slate-400 text-sm">- Or -</div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Full Name */}
        <div>
          <label className="label-input">Full Name</label>
          <input
            type="text"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={`input-default ${
              authError ? "input-error" : "input-focus"
            }`}
          />
        </div>

        {/* Email */}
        <div>
          <label className="label-input">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`input-default ${
              authError ? "input-error" : "input-focus"
            }`}
          />
        </div>

        {/* Password */}
        <div>
          <label className="label-input">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`input-default ${
                authError ? "input-error" : "input-focus"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-4 top-4 text-gray-400 hover:text-white cursor-pointer"
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
        </div>

        {authError && <p className="text-sm text-red-400">{authError}</p>}

        {/* Submit */}
        <button type="submit" className="w-full btn-primary min-h-12">
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      {/* Switch */}
      <div className="text-slate-400 text-center mt-8">
        Already have an account?{" "}
        <button
          className="underline hover:text-text-primary cursor-pointer"
          onClick={onSwitchToLogin}
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

export default SignUpPopUp;
