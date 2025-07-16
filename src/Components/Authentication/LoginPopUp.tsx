import { useEffect, useState, useRef } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { ZodError } from "zod";
import { useOutsidePopUpClose } from "../../hooks/useOutsidePopUpClose";
import { loginSchema } from "../../utils/loginValidation";

interface LoginPopUpProps {
  open: boolean;
  onClose: () => void;
}

const LoginPopUp = ({ open, onClose }: LoginPopUpProps) => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    login?: string;
    password?: string;
    auth?: string;
  }>({});

  //Closing pop-up on click outside or "Esc"

  const loginRef = useRef<HTMLDivElement | null>(null);

  useOutsidePopUpClose(
    loginRef as React.RefObject<HTMLDivElement>,
    onClose,
    open
  );

  //Cleaning input fields upon close

  useEffect(() => {
    if (!open) {
      setLogin("");
      setPassword("");
      setErrors({});
    }
  }, [open]);

  //Form submission handling

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      loginSchema.parse({ login, password });
      setErrors({});

      if (login !== "test@example.com" || password !== "Test1234") {
        setErrors({ auth: "Your login or password is incorrect" });
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
    <div className="fixed px-4 inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        ref={loginRef}
        className="relative w-full max-w-sm rounded-xl bg-slate-800 p-6 text-white shadow-xl"
      >
        <button
          onClick={onClose}
          className="absolute top-1 right-3 text-gray-500 text-3xl font-regular
           hover:cursor-pointer hover:text-gray-400"
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
                errors.login ? "input-error" : "input-focus"
              }`}
            />
            {errors.login && (
              <p className="mt-1 text-sm text-red-400">{errors.login}</p>
            )}
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
                  errors.password ? "input-error" : "input-focus"
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
            {errors.password && (
              <p className="mt-1 text-sm text-red-400">{errors.password}</p>
            )}
          </div>

          {errors.auth && <p className="text-sm text-red-400">{errors.auth}</p>}

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={!login.trim() || !password.trim()}
              className="mt-8 btn-primary px-6 min-h-12"
            >
              Log In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPopUp;
