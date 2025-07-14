import { useEffect, useState, useRef } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { z, ZodError } from "zod";

interface LoginPopUpProps {
  open: boolean;
  onClose: () => void;
}

const schema = z.object({
  login: z
    .string()
    .min(1, "Please enter your login")
    .email("Please enter a valid email"),
  password: z
    .string()
    .min(1, "Please enter your password")
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

const LoginPopUp = ({ open, onClose }: LoginPopUpProps) => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    login?: string;
    password?: string;
    auth?: string;
  }>({});

  useEffect(() => {
    if (!open) {
      setLogin("");
      setPassword("");
      setErrors({});
    }
  }, [open]);

  const loginRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (loginRef.current && !loginRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (open) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      schema.parse({ login, password });
      setErrors({}); // Clear previous

      // Fake login check
      if (login !== "test@example.com" || password !== "Test1234") {
        setErrors({ auth: "Please enter correct login information" });
        return;
      }

      alert("Logged in successfully!");
      onClose();
    } catch (err) {
      if (err instanceof ZodError) {
        const fieldErrors: { login?: string; password?: string } = {};
        for (const issue of err.issues) {
          const field = issue.path[0] as "login" | "password";
          fieldErrors[field] = issue.message;
        }
        setErrors(fieldErrors);
      } else {
        console.error("Unexpected error:", err);
      }
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        ref={loginRef}
        className="relative w-full max-w-sm rounded-xl bg-slate-800 p-6 text-white shadow-xl"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-2xl font-bold hover:text-white hover:cursor-pointer"
          aria-label="Close login popup"
        >
          ×
        </button>

        <h2 className="mb-6 text-2xl font-semibold text-center text-green-300">
          Log In
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Login Field */}
          <div>
            <label className="block mb-1 text-sm">Login</label>
            <input
              type="text"
              placeholder="you@example.com"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className={`w-full rounded-md bg-slate-700 px-3 py-2 text-sm outline-none ${
                errors.login
                  ? "ring-2 ring-red-400"
                  : "focus:ring-2 focus:ring-green-400"
              }`}
              required
            />
            {errors.login && (
              <p className="mt-1 text-sm text-red-400">{errors.login}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block mb-1 text-sm">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full rounded-md bg-slate-700 px-3 py-2 text-sm pr-10 outline-none ${
                  errors.password
                    ? "ring-2 ring-red-400"
                    : "focus:ring-2 focus:ring-green-400"
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-400">{errors.password}</p>
            )}
          </div>

          {/* Auth error */}
          {errors.auth && <p className="text-sm text-red-400">{errors.auth}</p>}

          <button type="submit" className="btn-primary w-full">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPopUp;
