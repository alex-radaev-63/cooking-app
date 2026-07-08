import { createContext, useContext, useEffect, useState, useRef } from "react";
import { supabase } from "../../supabase-client";
import type { Session } from "@supabase/supabase-js";
import { ZodError } from "zod";
import { loginSchema } from "../../utils/loginValidation";
import { householdManageDB } from "../../services/householdManageDB";

type OAuthProvider = "google" | "github" | "apple";

interface AuthContextValue {
  user: any;
  householdId: string | null;
  selectHousehold: (id: string) => void;
  loading: boolean;
  logIn: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  signInWithProvider: (provider: OAuthProvider) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    metadata?: { full_name?: string },
  ) => Promise<{ success: boolean; error?: string; data?: any }>;
  logOut: () => Promise<void>;

  isAuthOpen: boolean;
  authMode: "login" | "signup";
  openAuth: (mode?: "login" | "signup") => void;
  closeAuth: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [householdId, setHouseholdId] = useState<string | null>(null);

  const isHandlingSession = useRef(false);

  const selectHousehold = (id: string) => {
    setHouseholdId(id);
    localStorage.setItem("activeHouseholdId", id);
  };

  useEffect(() => {
    const handleSession = async (session: Session | null) => {
      if (isHandlingSession.current) return;

      isHandlingSession.current = true;

      try {
        const currentUser = session?.user ?? null;

        setUser(currentUser);

        if (currentUser) {
          const defaultHouseholdId =
            await householdManageDB.getOrCreateHousehold(currentUser.id);

          const savedHouseholdId = localStorage.getItem("activeHouseholdId");

          setHouseholdId(savedHouseholdId ?? defaultHouseholdId);
        } else {
          setHouseholdId(null);
        }
      } catch (error) {
        console.error("Failed to create/get household:", error);
      } finally {
        setLoading(false);
        isHandlingSession.current = false;
      }
    };

    // Check session on first load
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session);
    });

    // Listen to auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        handleSession(session);
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const logIn = async (email: string, password: string) => {
    try {
      // Frontend validation
      loginSchema.parse({ login: email, password });

      setLoading(true);

      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setLoading(false);
        return { success: false, error: error.message };
      }

      // Immediately update user
      setUser(data.user);

      // Create/get household and store ID
      const householdId = await householdManageDB.getOrCreateHousehold(
        data.user.id,
      );

      setHouseholdId(householdId);

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

  const signInWithProvider = async (provider: OAuthProvider) => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin,
      },
    });
  };

  const signUp = async (
    email: string,
    password: string,
    metadata?: { full_name?: string },
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: metadata?.full_name,
        },
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  };

  const logOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setHouseholdId(null);
    setLoading(false);
  };

  const openAuth = (mode: "login" | "signup" = "login") => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const closeAuth = () => {
    setIsAuthOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        householdId,
        selectHousehold,
        loading,
        logIn,
        signInWithProvider,
        logOut,
        isAuthOpen,
        authMode,
        openAuth,
        closeAuth,
        signUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) throw new Error("useAuth must be used within AuthProvider");

  return context;
};
