import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../../supabase-client";
import { ZodError } from "zod";
import { loginSchema } from "../../utils/loginValidation";

interface AuthContextValue {
  user: any;
  loading: boolean;
  logIn: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logOut: () => Promise<void>;
  isLoginOpen: boolean;
  openLogin: () => void;
  closeLogin: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    // Check session on first load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen to auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false); // ✅ make sure loading is false after state change
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const logIn = async (email: string, password: string) => {
    try {
      // ✅ Frontend validation
      loginSchema.parse({ login: email, password });

      setLoading(true); // ✅ Start loading before login

      // ✅ Supabase login
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setLoading(false);
        return { success: false, error: error.message };
      }

      // ✅ Immediately set user so UI updates without waiting for event
      setUser(data.user);
      setLoading(false);

      return { success: true };
    } catch (err) {
      setLoading(false);
      if (err instanceof ZodError) {
        return { success: false, error: err.issues[0].message };
      }
      return { success: false, error: "Unexpected error occurred" };
    }
  };

  const logOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setLoading(false);
  };

  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => setIsLoginOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        logIn,
        logOut,
        isLoginOpen,
        openLogin,
        closeLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
