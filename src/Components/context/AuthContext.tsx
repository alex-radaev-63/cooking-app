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
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const logIn = async (email: string, password: string) => {
    try {
      // Frontend validation
      loginSchema.parse({ login: email, password });

      // Supabase login
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err) {
      if (err instanceof ZodError) {
        return { success: false, error: err.issues[0].message };
      }
      return { success: false, error: "Unexpected error occurred" };
    }
  };

  const logOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
